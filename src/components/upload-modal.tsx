"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import DropZone from "react-dropzone";
import { FileIcon, LoaderIcon, UploadCloudIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadDropZone = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { startUpload } = useUploadThing("pdfUploader");
  const { toast } = useToast();

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      toast({
        title: "Success",
        description: "File uploaded",
        variant: "default",
      });
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
  });

  const startSimulateProgress = () => {
    setIsUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setIsUploading(false);
          return 0;
        }
        return prev + 10;
      });
    }, 1000);

    return interval;
  };

  return (
    <DropZone
      accept={{
        "application/pdf": [".pdf"],
      }}
      multiple={false}
      onFileDialogOpen={() => {}}
      onDrop={async (file) => {
        const progressinterval = startSimulateProgress();

        const res = await startUpload(file);

        if (!res) {
          return toast({
            title: "Error",
            description: "Failed to upload file",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;

        const key = fileResponse.key;

        if (!key) {
          return toast({
            title: "Error",
            description: "Failed to upload file",
            variant: "destructive",
          });
        }

        clearInterval(progressinterval);
        setProgress(100);
        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-muted-foreground rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloudIcon className="w-6 h-6 text-muted-foreground " />
                <p className="text-sm font-semibold">
                  Click to upload{" "}
                  <span className="font-normal">or drag and drop</span>
                </p>
                <p className="text-xs text-muted-foreground">Pdf (up to 4MB)</p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs flex items-center rounded-md overflow-hidden outline-[1px] outline-foreground border border-muted-foreground divide-x divide-muted-foreground">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <FileIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}
              {isUploading && (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={progress}
                    className="h-1 w-full dark:bg-white bg-zinc-200"
                  />
                  {progress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-foreground text-center pt-2">
                      <LoaderIcon className="w-3 h-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              )}
              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </DropZone>
  );
};

function UploadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={toggleOpen}
          variant={"default"}
          size={"default"}
          className="text-white dark:bg-violet-700 dark:hover:bg-violet-800"
        >
          Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropZone />
      </DialogContent>
    </Dialog>
  );
}

export default UploadButton;
