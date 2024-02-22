import { db } from "@/app/db";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { sendMessageValidator } from "@/lib/validators/sendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest } from "next/server";
import {OpenAIStream, StreamingTextResponse} from "ai"



export const POST = async (req: NextRequest) =>{
    // endpoint for asking a question to the pdf
    const body = await req.json();
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if (!user?.id) return new Response("Unauthorized", { status: 401 });
    const {id: userId } = user

    const {fileId, message} = sendMessageValidator.parse(body)

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId
        }
    })
    if (!file) return new Response("File Not Found", { status: 404 });

    await db.message.create({
        data:{
            isUserMessage: true,
            text: message,
            fileID: fileId,
            userId
        }
    })

    // vectorize the message, get the pdf page, send it to the model, and return the response

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_KEY!,
        configuration:{
            dangerouslyAllowBrowser: false,
        }
    })
    
    const pineconeIndex = pinecone.index("olly")
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace: file.id,
    })

    const results = await vectorStore.similaritySearch(message, 4)

    const prevMessages = await db.message.findMany({
        where:{
            fileID: fileId
        },
        orderBy:{
            createdAt: "asc"
        },
        take: 10
    })

    const formattedMessages = prevMessages.map((message) => {
        return {
            content: message.text,
            role: message.isUserMessage? "user": "assistant"
        }
    })

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0,
        stream: true,
        messages: [
            {
              role: 'system',
              content:
                'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
            },
            {
              role: 'user',
              content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
              
        \n----------------\n
        
        PREVIOUS CONVERSATION:
        ${formattedMessages.map((message) => {
          if (message.role === 'user') return `User: ${message.content}\n`
          return `Assistant: ${message.content}\n`
        })}
        
        \n----------------\n
        
        CONTEXT:
        ${results.map((r) => r.pageContent).join('\n\n')}
        
        USER INPUT: ${message}`,
            },
          ],
          })

        const stream = OpenAIStream(response, {
            async onCompletion(completion) {
                await db.message.create({
                    data:{
                        text: completion,
                        isUserMessage: false,
                        fileID: fileId,
                        userId
                    }
                }) 
            },
        })

        return new StreamingTextResponse(stream)
}