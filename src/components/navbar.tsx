import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ModeToggle } from "./ModeToggle";

function NavBar() {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 dark:border-gray-600 bg-white/75 dark:bg-[#191429]/75 backdrop-blur-lg transition-all flex items-center">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-600">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Olly</span>
          </Link>
          {/* todo: mobile navbar */}

          <div className="hidden items-center space-x-4 sm:flex">
            <ModeToggle />
            <>
              <Link href={"/pricing"}>
                <Button variant={"ghost"} size={"sm"}>
                  Pricing
                </Button>
              </Link>
              <LoginLink>
                <Button variant={"ghost"} size={"sm"}>
                  Sign In
                </Button>
              </LoginLink>
              <RegisterLink>
                <Button
                  size={"sm"}
                  className="rounded-full bg-foreground hover:bg-foreground/90 drop-shadow-lg"
                >
                  Get started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </RegisterLink>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default NavBar;
