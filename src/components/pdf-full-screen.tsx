"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { ExpandIcon, Loader2Icon } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import "simplebar-react/dist/simplebar.min.css";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "./ui/use-toast";

interface PDFFullScreenProps {
  url: string;
}

function PDFFullScreen({ url }: PDFFullScreenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, width } = useResizeDetector();
  const [number_of_pages, set_number_of_pages] = useState<number>();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(!isOpen)}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button aria-label="Full Screen" variant={"ghost"} className="gap-1.5">
          <ExpandIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              className="max-h-full"
              onLoadSuccess={(pdf) => set_number_of_pages(pdf.numPages)}
              onLoadError={() => {
                toast({
                  title: "Error",
                  description: "Error Loading the PDF",
                  variant: "destructive",
                });
              }}
              loading={
                <div className="flex justify-center">
                  <Loader2Icon className="my-24 w-6 h-6 animate-spin" />
                </div>
              }
              file={url}
            >
              {new Array(number_of_pages).fill(0).map((_, i) => (
                <Page key={i} pageNumber={i + 1} width={width ?? 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}

export default PDFFullScreen;
