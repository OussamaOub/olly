"use client";
import Messages from "./messages";
import ChatInput from "./chat-input";
import { trpc } from "@/app/_trpc/client";
import { Loader2Icon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChatContextProvider } from "./ChatContext";

interface ChatWrapperProps {
  fileId: string;
}

function ChatWrapper({ fileId }: ChatWrapperProps) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data.state.data?.status === "SUCCESS" ||
        data.state.data?.status === "FAILED"
          ? false
          : 500,
    }
  );

  if (isLoading)
    return (
      <div className="relative min-h-full bg-zinc-50 dark:bg-[#191630] flex divide-y divide-muted-foreground flex-col justify-between gap-2 ">
        <div className="flex-1 flex justify-center items-center flex-col mb-28 ">
          <div className="flex flex-col items-center gap-2">
            <Loader2Icon className="h-8 w-8 text-blue-500 dark:text-violet-500 animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-muted-foreground text-sm">
              We&apos;re preparing your pdf
            </p>
          </div>
        </div>
        <ChatInput disabled />
      </div>
    );

  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-zinc-50 dark:bg-[#191630] flex divide-y divide-muted-foreground flex-col justify-between gap-2 ">
        <div className="flex-1 flex justify-center items-center flex-col mb-28 ">
          <div className="flex flex-col items-center gap-2">
            <Loader2Icon className="h-8 w-8 text-blue-500 dark:text-violet-500 animate-spin" />
            <h3 className="font-semibold text-xl">Processing PDF...</h3>
            <p className="text-muted-foreground text-sm">
              This won&apos;t take long!
            </p>
          </div>
        </div>
        <ChatInput disabled />
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative min-h-full bg-zinc-50 dark:bg-[#191630] flex divide-y divide-muted-foreground flex-col justify-between gap-2 ">
        <div className="flex-1 flex justify-center items-center flex-col mb-28 ">
          <div className="flex flex-col items-center gap-2">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <h3 className="font-semibold text-xl">Too many pages in PDF...</h3>
            <p className="text-muted-foreground text-sm">
              Your <span className="font-medium">Free</span> plan supports up to
              5 pages per PDF.
            </p>
            <p className="text-muted-foreground text-sm">
              Upgrade to a{" "}
              <Link href="/pricing" className="font-medium">
                Pro
              </Link>{" "}
              plan to increase the limit. Or upload a smaller PDF.
            </p>
          </div>
          <Link href={"/dashboard"}>
            <Button variant={"secondary"} size={"sm"} className="mt-4">
              Go back
            </Button>
          </Link>
        </div>
        <ChatInput disabled />
      </div>
    );

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full bg-zinc-50 dark:bg-[#191630] flex divide-y divide-muted-foreground flex-col justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages fileId={fileId} />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
}

export default ChatWrapper;
