"use client";
import Image from "next/image";

export const Logo = ({ isUser }: { isUser?: boolean }) => {
  return (
    <div className="flex items-center">
      <Image
        src="/icons/logo.png"
        width={40}
        height={40}
        alt="Logo"
        className={`dark:hidden ${isUser && "hidden"}`}
      />
      <Image
        src="/icons/logo-dark.png"
        width={40}
        height={40}
        alt="Logo"
        className={`hidden dark:block ${isUser && "hidden"}`}
      />
      <Image
        src="/icons/user-icon.png"
        width={40}
        height={40}
        alt="Logo"
        className={`dark:hidden ${!isUser && "hidden"}`}
      />
      <Image
        src="/icons/user-icon-dark.png"
        width={40}
        height={40}
        alt="Logo"
        className={`hidden dark:block ${!isUser && "hidden"}`}
      />
    </div>
  );
};
