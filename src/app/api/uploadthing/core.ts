import { db } from "@/app/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {PDFLoader} from "langchain/document_loaders/fs/pdf"
import { OpenAIEmbeddings } from "@langchain/openai";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
const f = createUploadthing();
 

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
            const {getUser} = getKindeServerSession()
            const user = await getUser()
            if (!user || !user.email) {
                throw new UploadThingError("Unauthorized")
            }
            return{userId: user.id}
        })
    .onUploadComplete(async ({ metadata, file }) => { 
        // save file to database
        const createdFile = await db.file.create({
            data:{
                userId: metadata.userId,
                name: file.name,
                key: file.key,
                url: file.url,
                uploadStatus: "PROCESSING",
            }
        })

        try{
            const response = await fetch(createdFile.url)
            const blob = await response.blob()
            const loader = new PDFLoader(blob)
            const pageLevelDocs = await loader.load()
            const pagesAmt = pageLevelDocs.length
            const pineconeIndex = pinecone.index("olly")
            const embeddings = new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_KEY!,
                configuration:{
                    dangerouslyAllowBrowser: false,
                }
            })
            await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
                pineconeIndex,
                namespace: createdFile.id,

            })

            await db.file.update({
                data:{
                    uploadStatus: "SUCCESS",
                    pagesAmt,
                },
                where:{
                    id: createdFile.id
                }
            })
        }
        catch (error) {
            await db.file.update({
                data:{
                    uploadStatus: "FAILED",
                },
                where:{
                    id: createdFile.id
                }
            })
        }

    }),
    
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;