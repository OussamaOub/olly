import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="group mx-auto mb-4 flex max-w-fit items-center justify-center sapce-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-200/90">
            Olly molly
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Chat with your <span className="text-blue-600">documents</span> in
          seconds
        </h1>
        <p className="mt-5 max-w-prose text-foreground/55 sm:text-lg">
          Olly allows you to have conversations with any pdf document. Simply
          upload your file and start asking right away.
        </p>
        <Link target="_blank" href="/dashboard">
          <Button variant={"outline"} className="rounded-full mt-8" size={"lg"}>
            Get started <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </MaxWidthWrapper>

      {/* Value Proposition Section */}
      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-auto blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1.5 rotate-[30deg] bg-gradient-to-tr from-[#30668f] to-[#076447] dark:from-[#ff80b5] dark:to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 dark:bg-gray-700/50 p-2 ring-1 ring-inset ring-gray-900/10 dark:ring-gray-700 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src={"/dashboard-preview.jpg"}
                    width={1364}
                    height={866}
                    quality={100}
                    alt="Dashboard preview"
                    className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10 dark:ring-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-auto blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1.5 rotate-[30deg] bg-gradient-to-tr from-[#30668f] to-[#076447] dark:from-[#ff80b5] dark:to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      {/* Feature Section */}

      <div className="mx-auto mt-32 mb-32 max-w-5xl sm:mt-56 ">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-foreground sm:text-5xl">
              Start Chatting in seconds
            </h2>
            <p className="mt-4 text-lg text-foreground/50">
              Chatting with your documents has never been easier with Olly.
              You're just a few clicks away from knowledge!
            </p>
          </div>
        </div>

        {/* Steps */}
        <ol className="my-8 space-y-4 pt-4 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-muted-foreground py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 1</span>
              <span className="text-xl font-semibold">
                Sign up for an account
              </span>
              <span className="mt-2 text-muted-foreground">
                Either starting out with a free plan or choose our{" "}
                <Link
                  href="/pricing"
                  className="text-blue-700 underline-offset-2 underline"
                >
                  pro plan
                </Link>
                .
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-muted-foreground py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 2</span>
              <span className="text-xl font-semibold">
                Upload your document
              </span>
              <span className="mt-2 text-muted-foreground">
                Let Olly do the magic and convert your document into a chat
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-muted-foreground py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 2</span>
              <span className="text-xl font-semibold">
                Start Asking Questions
              </span>
              <span className="mt-2 text-muted-foreground">
                Olly will answer your questions based on the content of the
                document. It&apos;s that simple!
              </span>
            </div>
          </li>
        </ol>

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 dark:bg-gray-700/50 p-2 ring-1 ring-inset ring-gray-900/10 dark:ring-gray-700 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src={"/file-upload-preview.jpg"}
                width={1419}
                height={732}
                quality={100}
                alt="Uploading preview"
                className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10 dark:ring-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
