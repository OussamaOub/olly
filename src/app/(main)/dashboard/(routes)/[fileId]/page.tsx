import { trpc } from "@/app/_trpc/client";
import { db } from "@/app/db";
import ChatWrapper from "@/components/chat/chat-wrapper";
import PDFRenderer from "@/components/pdf-renderer";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    fileId: string;
  };
}

async function Chat({ params }: PageProps) {
  const { fileId } = params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return redirect(`/auth-callback?origin=dashboard/${fileId}`);
  }

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    return notFound();
  }

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left Side (pdf view) */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer url={file.url} />
          </div>
        </div>
        {/* Right Side (chat) */}
        <div className="shrink-0 flex-[0.75] border-t border-muted-foreground lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={fileId} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
