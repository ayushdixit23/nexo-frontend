import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Taskbar from "../components/Taskbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Taskbar />
      <div className="w-screen h-screen bg-[#F6F6F6]">
        <div className="w-full h-full flex sm:flex-row flex-col justify-center items-center">
          <div className="w-[22%] pn:max-sm:hidden h-full">
            <Sidebar />
          </div>
          <div className="sm:hidden w-full h-[9%] flex justify-center items-center">
            <Header />
          </div>
          <div className="w-[78%] pn:max-sm:w-full pn:max-sm:mb-[84px] overflow-y-scroll no-scrollbar bg-[#F6F6F6] p-3 sm:p-5 h-[91%] sm:h-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
