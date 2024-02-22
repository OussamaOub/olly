import NavBar from "@/components/navbar";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default Layout;
