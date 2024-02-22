import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/app/db';
import { z } from 'zod';
import { utapi } from '@/server/uploadthing';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
 
export const appRouter = router({
  authCallback: publicProcedure.query(async() =>{
    
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user?.email) {
      throw new TRPCError({code:"UNAUTHORIZED"})
    }

    // check if user is in database
    const dbUser = await db.user.findFirst({
      where:{
        id: user.id
      }
    })

    if (!dbUser) {
      // create user in database
      await db.user.create({
        data:{
          id: user.id,
          email: user.email,
          picture: user.picture,
          givenName: user.given_name,
          familyName: user.family_name,
          
        }
      })
    }
    return {success: true}
  }),
  getUserFiles: privateProcedure.query(async({ctx}) =>{
    const files = await db.file.findMany({
      where:{
        userId: ctx.userId
      }
    })
    return files;
  }),
  deleteFile: privateProcedure.input(z.object({id: z.string()})).mutation(async({input, ctx}) =>{
    const file = await db.file.findFirst({
      where:{
        id: input.id,
        userId: ctx.userId
      }
    })
    if (!file) {
      throw new TRPCError({code:"NOT_FOUND"})
    }
    await utapi.deleteFiles(file.key);
    await db.file.delete({
      where:{
        id: file.id
      }
    })
    return file;
  }),
  getFile: privateProcedure.input(z.object({key: z.string()})).mutation(async({input, ctx}) =>{
    const {userId} = ctx
    const file = await db.file.findFirst({
      where:{
        key: input.key,
        userId
      }
    })
    if (!file) {
      throw new TRPCError({code:"NOT_FOUND"})
    }

    return file;
  }),
  getFileUploadStatus: privateProcedure.input(z.object({fileId: z.string()})).query(async({input, ctx}) =>{
    const file = await db.file.findFirst({
      where:{
        id: input.fileId,
        userId: ctx.userId
      }
    })
    if (!file) {
      return {status: "PENDING" as const}
    }
    return {status: file.uploadStatus}
  }),
  getFileMessages: privateProcedure.input(z.object({fileId: z.string(), limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish()
  })).query(async({input, ctx}) =>{

    const {userId} = ctx
    const {fileId, cursor} = input
    const limit = input.limit ?? INFINITE_QUERY_LIMIT
    
    const file = await db.file.findFirst({
      where:{
        id: fileId,
        userId
      }
    })
    if (!file) {
      throw new TRPCError({code:"NOT_FOUND"})
    }

    const messages = await db.message.findMany({
      where:{
        fileID: fileId,
      },
      take: limit + 1,
      orderBy:{
        createdAt: "desc"
      },
      cursor: cursor ? {
        id: cursor
      }: undefined,
      select:{
        id: true,
        text: true,
        createdAt: true,
        isUserMessage: true
      }
    })
    return {
      messages: messages.slice(0, limit),
      nextCursor: messages.length > limit ? messages[limit - 1].id : null
    }
  }
  ),
});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
