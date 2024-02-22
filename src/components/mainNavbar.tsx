"use client";
import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 dark:border-gray-600 bg-white/75 dark:bg-[#191429]/75 backdrop-blur-lg transition-all flex items-center">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-600">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Olly</span>
          </Link>
          {/* todo: mobile navbar */}

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link href={"/dashboard"}>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className={cn(
                    pathname === "/dashboard" && "bg-gray-200 dark:bg-gray-800"
                  )}
                >
                  Dashboard
                </Button>
              </Link>
            </>
            <ModeToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default NavBar;
