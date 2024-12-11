import Image from "next/image";
import React from "react";
import NexoLogin from "@/app/assets/nexo-login.png";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen h-dvh sm:h-screen bg-[#FFC977]">
      <div className="w-full h-full grid sm:grid-cols-2 px-5">
        <div className="sm:flex hidden justify-center  items-center">
          <div className="w-[80%] h-[60%] flex justify-center -mt-7 items-center">
            <Image src={NexoLogin} alt="nexo" className="w-full h-full" />
          </div>
        </div>
        <div className="flex justify-center w-full items-center">
          <div className="w-full h-auto flex justify-center items-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
