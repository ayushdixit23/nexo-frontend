"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function ChatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  return (
    <>
      <div className={`flex flex-col gap-7 h-full`}>
        <div
          className={`${
            path === "/chats" || path === "/chats/teams"
              ? "sm:h-[9%] "
              : "hidden"
          }`}
        >
          <div className="flex bg-white rounded-xl z-10 justify-between p-3 shadow-sm sm:p-4 border-b items-center w-full">
            <div className="flex justify-center items-center gap-2 sm:gap-6">
              <Link
                href="/chats"
                className={`${
                  path === "/chats" &&
                  "font-semibold border-b-4 border-[#FFC977]"
                } text-[13px] sm:text-[17px] p-2`}
              >
                My Chats
              </Link>
              <Link
                href="/chats/teams"
                className={`${
                  path === "/chats/teams" &&
                  "font-semibold border-b-4 border-[#FFC977]"
                } text-[13px] sm:text-[17px] p-2`}
              >
                Team Chats
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`${
            path === "/chats/teams" || path === "/chats"
              ? "sm:h-[91%] "
              : "h-full"
          } overflow-y-scroll no-scrollbar`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
