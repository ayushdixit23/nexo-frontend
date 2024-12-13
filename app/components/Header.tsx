"use client";
import Image from "next/image";
import React from "react";
import { useAuthContext } from "../(utilities)/utils/auth";

const Header = () => {
  const { data } = useAuthContext();
  return (
    <>
      <div className="flex bg-white justify-between items-center gap-2 h-full w-full px-3">
        <div className="w-[40px] h-[40px] overflow-hidden rounded-full">
          <Image
            className="w-full h-full object-cover"
            src={data?.profilepic ? data?.profilepic : ""}
            alt={data?.fullname ? data?.fullname : ""}
            width={40}
            height={40}
          />
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Header;
