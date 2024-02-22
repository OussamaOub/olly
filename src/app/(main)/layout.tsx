import MainNavBar from "@/components/mainNavbar";
import { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <MainNavBar />
      <main>{children}</main>
    </>
  );
}

export default Layout;
