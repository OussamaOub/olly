import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Olly",
  description: "Talk with your PDFs",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme:light)",
        url: "/icons/logo.png",
        href: "/icons/logo.png",
      },
      {
        media: "(prefers-color-scheme:dark)",
        url: "/icons/logo-dark.png",
        href: "/icons/logo-dark.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="olly-theme"
      > */}
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen font-sans antialiased min-w-[468px]",
          inter.className
        )}
      >
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
      {/* </ThemeProvider> */}
    </html>
  );
}
