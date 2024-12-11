"use client";
import { useAuthContext } from "@/app/(utilities)/utils/AuthUser";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { RiSearch2Line } from "react-icons/ri";
import { RxCrossCircled } from "react-icons/rx";

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const { data } = useAuthContext();
  const [isMytasks, setIsMytasks] = useState(false);
  const [teamTasks, setTeamTasks] = useState(false);
  return (
    <>
      {isMytasks && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <div className="md:w-[30%] flex shadow-md flex-col gap-5 bg-white p-4 rounded-xl h-auto">
            <div className="flex justify-between py-1 items-center w-full">
              <div className="text-[#121212] font-semibold">Add New Task</div>
              <div
                className="cursor-pointer"
                onClick={() => setIsMytasks(false)}
              >
                <RxCrossCircled className="text-xl text-black" />
              </div>
            </div>
            <div>
              <textarea
                name=""
                cols={30}
                rows={10}
                className="w-full min-h-[150px] h-[150px] max-h-[200px] rounded-xl border p-2 text-sm border-[#FFC977] shadow-md outline-none"
                id=""
              ></textarea>
            </div>
            <div className="flex justify-center items-center font-medium gap-3 text-sm">
              <button
                onClick={() => setIsMytasks(false)}
                className="text-center p-3 px-5 rounded-full w-full border "
              >
                Cancel
              </button>
              <button className="text-center p-3 px-5 rounded-full w-full bg-[#FFC248]">
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}

      {teamTasks && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <div className="flex sm:flex-row flex-col shadow-md gap-3 bg-[#FAF9F6] p-3 rounded-xl h-auto">
            <div className="flex min-w-[300px] pn:max-sm:order-2 bg-white p-4 flex-col gap-5 rounded-xl">
              <div className="flex justify-between py-1 items-center w-full">
                <div className="text-[#121212] font-semibold">Add New Task</div>
                <div
                  className="cursor-pointer"
                  onClick={() => setTeamTasks(false)}
                >
                  <RxCrossCircled className="text-xl text-black" />
                </div>
              </div>
              <div>
                <textarea
                  name=""
                  cols={30}
                  rows={10}
                  className="w-full min-h-[150px] h-[150px] max-h-[200px] rounded-xl border p-2 text-sm border-[#FFC977] shadow-md outline-none"
                  id=""
                ></textarea>
              </div>
              <div className="flex justify-center items-center font-medium gap-3 text-sm">
                <button
                  onClick={() => setTeamTasks(false)}
                  className="text-center p-3 px-5 rounded-full w-full border "
                >
                  Cancel
                </button>
                <button className="text-center p-3 px-5 rounded-full w-full bg-[#FFC248]">
                  Save Task
                </button>
              </div>
            </div>

            <div className=" flex min-w-[300px] pn:max-sm:order-1 flex-col gap-3 h-auto">
              <div className="flex p-4 rounded-xl bg-white items-center gap-2">
                <MdOutlinePersonAddAlt1 />
                <div>Assign task to</div>
              </div>
              <div className="flex flex-col gap-4 justify-center p-4 px-3 rounded-xl bg-white items-center">
                <div className="flex rounded-xl text-[12px] w-full bg-[#FFF8EB] items-center p-2">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent outline-none px-1  text-black text-sm"
                  />
                  <RiSearch2Line className="text-black text-[20px] mr-2" />
                </div>
                <div className="w-full flex mt-2 flex-col gap-5 overflow-y-scroll no-scrollbar max-h-[150px]">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex w-full items-center gap-3">
                      <div className="w-[40px] h-[40px] overflow-hidden">
                        <Image
                          className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
                          src={data?.profilepic ? data?.profilepic : ""}
                          alt={data?.fullname ? data?.fullname : ""}
                          width={40}
                          height={40}
                        />
                      </div>

                      <div className="text-sm font-semibold">
                        {data?.fullname}
                      </div>
                    </div>
                  ))}

                  {/* <div className="flex w-full items-center gap-3">
                    <div className="w-[40px] h-[40px] overflow-hidden">
                      <Image
                        className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
                        src={data?.profilepic ? data?.profilepic : ""}
                        alt={data?.fullname ? data?.fullname : ""}
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="text-sm font-semibold">
                      {data?.fullname}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`flex flex-col h-full`}>
        <div className="sm:h-[9%]">
          <div className="flex bg-white rounded-xl justify-between p-3 sm:p-4 border-b items-center w-full">
            <div className="flex justify-center items-center gap-2 sm:gap-6">
              <Link
                href="/tasks/mytasks"
                className={`${
                  path === "/tasks/mytasks" &&
                  "font-semibold border-b-4 border-[#FFC977]"
                } text-[13px] sm:text-[17px] p-2`}
              >
                My Tasks
              </Link>
              <Link
                href="/tasks/teamtasks"
                className={`${
                  path === "/tasks/teamtasks" &&
                  "font-semibold border-b-4 border-[#FFC977]"
                } text-[13px] sm:text-[17px] p-2`}
              >
                Team Tasks
              </Link>
            </div>

            <div className="flex justify-center items-center gap-1">
              <button
                onClick={() => {
                  if (path.startsWith("/tasks/mytasks")) {
                    setIsMytasks(true);
                  }
                  if (path.startsWith("/tasks/teamtasks")) {
                    setTeamTasks(true);
                  }
                }}
                className="flex justify-center items-center gap-1 font-medium text-sm sm:p-3 p-1 sm:px-6 rounded-full bg-[#FFC977]"
              >
                <BsPlus className="text-[21px]" />

                <div className="hidden sm:block">Add New Tasks</div>
              </button>
            </div>
          </div>
        </div>
        <div className="sm:h-[91%] flex justify-center items-center h-full">
          {children}
        </div>
      </div>
    </>
  );
}
