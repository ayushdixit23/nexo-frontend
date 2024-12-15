"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Taskbar from "../components/Taskbar";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
 // Check if we're on the main /chats or /chats/teams pages (without dynamic segments)
 const isChatPage = path === "/chats"; // Exact match for /chats
 const isTeamPage = path === "/chats/teams"; // Exact match for /chats/teams

 // Check if we're on dynamic chat or dynamic team pages (exclude base routes)
 const isDynamicChatPage = path.match(/^\/chats\/[^/]+$/); // Matches /chats/[dynamicId]
 const isDynamicTeamPage = path.match(/^\/chats\/teams\/[^/]+$/); // Matches /chats/teams/[dynamicId]

 // Hide Taskbar for dynamic chat/team pages (exclude the base routes /chats and /chats/teams)
 const shouldHideTaskbar = (isDynamicChatPage && !isTeamPage) || isDynamicTeamPage;

  return (
    <>
      {!shouldHideTaskbar && <Taskbar pathname={path} />}
      <div className="w-screen h-screen bg-[#F6F6F6]">
        <div className="w-full h-full flex sm:flex-row flex-col justify-center items-center">
          <div className="w-[22%] pn:max-sm:hidden h-full">
            <Sidebar path={path} />
          </div>
          {!shouldHideTaskbar && (
            <div className="sm:hidden w-full h-[9%] flex justify-center items-center">
              <Header />
            </div>
          )}
          <div
            className={`
      w-[78%] pn:max-sm:w-full
      ${
        shouldHideTaskbar
          ? "h-full "
          : "pn:max-sm:h-[91%] sm:h-[100%] pn:max-sm:mb-[84px]"
      } 
      overflow-y-scroll no-scrollbar bg-[#F6F6F6] p-3 sm:p-5
    `}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
