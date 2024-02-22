"use client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
  RotateCwIcon,
  SearchIcon,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { toast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import PDFFullScreen from "./pdf-full-screen";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type RendererProps = {
  url: string;
};

function PDFRenderer({ url }: RendererProps) {
  const { ref, width } = useResizeDetector();
  const [number_of_pages, set_number_of_pages] = useState<number>();
  const [current_page, set_current_page] = useState<number>(1);
  const [scale, set_scale] = useState<number>(1);
  const [rotation, set_rotation] = useState<number>(0);
  const [renderedScale, set_renderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  return (
    <div className="w-full bg-white dark:bg-secondary rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-muted-foreground flex items-center justify-between px-2 ">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={current_page === 1 || current_page === undefined}
            aria-label="previous page"
            variant={"ghost"}
            onClick={() =>
              set_current_page((prev) => (prev - 1 < 1 ? 1 : prev - 1))
            }
          >
            <ChevronDownIcon className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              min={1}
              disabled={number_of_pages === undefined} // disable the input if the pdf is not loaded
              max={number_of_pages}
              value={current_page}
              onChange={(e) => {
                // check if the user is typing a number
                if (e.target.value !== "" || !isNaN(parseInt(e.target.value))) {
                  if (parseInt(e.target.value) > number_of_pages!) {
                    set_current_page(number_of_pages!);
                  } else {
                    set_current_page(parseInt(e.target.value));
                  }
                } else {
                  set_current_page(1);
                }
              }}
              className="w-14 h-8"
            />
            <p className="text-foreground text-sm space-x-1">
              <span>/</span>
              <span>{number_of_pages ?? "X"}</span>
            </p>
          </div>
          <Button
            disabled={
              current_page === number_of_pages || current_page === undefined
            }
            aria-label="previous page"
            variant={"ghost"}
            onClick={() =>
              set_current_page((prev) =>
                prev + 1 > number_of_pages! ? number_of_pages! : prev + 1
              )
            }
          >
            <ChevronUpIcon className="w-6 h-6" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label="zoom" className="gap-1.5">
                <SearchIcon className="w-4 h-4" />
                {scale * 100 + "%"}
                <ChevronDownIcon className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              defaultValue={scale}
              // onChange={(e) => set_scale(parseFloat())}
            >
              <DropdownMenuItem
                onSelect={() => set_scale(0.25)}
                className="cursor-pointer"
              >
                25%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => set_scale(0.5)}
                className="cursor-pointer"
              >
                50%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => set_scale(0.75)}
                className="cursor-pointer"
              >
                75%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => set_scale(1)}
                className="cursor-pointer"
              >
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => set_scale(1.5)}
                className="cursor-pointer"
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => set_scale(2)}
                className="cursor-pointer"
              >
                200%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => set_scale(2.5)}
                className="cursor-pointer"
              >
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            aria-label="rotate 90°"
            variant="ghost"
            onClick={() => set_rotation((prev) => (prev + 90) % 360)}
          >
            <RotateCwIcon className="w-4 h-4" />
          </Button>
          <PDFFullScreen url={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
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
              {isLoading && renderedScale ? (
                <Page
                  pageNumber={current_page}
                  width={width ?? 1}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}
              <Page
                className={cn(isLoading && "hidden")}
                pageNumber={current_page}
                width={width ?? 1}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2Icon className="my-24 w-6 h-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => set_renderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}

export default PDFRenderer;
