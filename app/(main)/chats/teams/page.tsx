"use client";
import { useAuthContext } from "@/app/(utilities)/utils/AuthUser";
import Image from "next/image";
import React from "react";
import notasks from "../../../assets/no-tasks.png";
import { FaTasks } from "react-icons/fa";
import Link from "next/link";

const page = () => {
  const { data } = useAuthContext();

  const array = [{}, {}, {}, {}];

  return (
    <div className="flex flex-col gap-5 w-full h-[100%]">
      <>
        {array.length > 0 ? (
          <>
            {array?.map((_, index) => {
              return (
                <Link
                  href={`/chats/${index}`}
                  className="p-5 rounded-xl bg-white"
                  key={index}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-[50px] h-[50px] overflow-hidden">
                      <Image
                        className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
                        src={data?.profilepic || "/default-profile.png"} // Fallback to a default image if not provided
                        alt={data?.fullname || "User"} // Fallback to 'User' if no name is provided
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold">
                        {data?.fullname || "Unknown User"}
                      </div>

                      <p className="text-xs font-medium text-muted-foreground">
                        {data?.email || "Email not available"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </>
        ) : (
          <>
            <div className="flex justify-center items-center w-full h-full">
              <div className="sm:w-[400px] sm:h-[400px] w-[90%] flex flex-col justify-center items-center">
                <Image
                  src={notasks}
                  alt="notasks"
                  className="w-full h-full object-contain"
                />
                <div className="flex justify-center items-center gap-3">
                  <FaTasks />

                  <div className=" font-semibold">No Chats Found</div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default page;
