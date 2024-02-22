import React, { useContext, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SendIcon } from "lucide-react";
import { ChatContext } from "./ChatContext";

interface ChatInputProps {
  disabled?: boolean;
}

function ChatInput({ disabled }: ChatInputProps) {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);
  const textarearef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                placeholder="Enter your question..."
                rows={1}
                disabled={disabled}
                maxRows={4}
                ref={textarearef}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textarearef.current?.focus();
                  }
                }}
                onChange={handleInputChange}
                value={message}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue dark:scrollbar-thumb-violet scrollbar-thumb-rounded scrollbar-track-blue-lighter dark:scrollbar-track-violet-darker scrollbar-w-2 scrolling-touch"
              />
              <Button
                className="absolute bottom-1.5 right-[8px] text-white"
                disabled={disabled || isLoading}
                onClick={() => {
                  addMessage();
                  textarearef.current?.focus();
                }}
              >
                <SendIcon className="w-4 h-4" aria-label="Send Message" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
