"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import { CloudUpload } from "lucide-react";

function page() {
  return (
    <div className="w-full h-auto">
      <div className="h-[100%] gap-4 w-full flex flex-col ">
        <div className="sm:h-[60px] h-auto w-full py-2 flex flex-row pn:max-sm:flex-col sm:items-center sm:justify-between">
          <div className="sm:h-[50px] h-auto w-full sm:w-[50%] bg-white sm:mt-6 py-2 flex items-center px-2 text-[12px] rounded-2xl mb-6 text-[#BEBEBE]">
            <input
              type="text"
              placeholder="Search files"
              className="w-full bg-transparent outline-none px-1 py-2 text-black text-sm"
            />
            <RiSearch2Line className="text-black text-[20px] mr-2" />
          </div>
          {/* Storage used */}
          <div className="w-[45%] pn:max-sm:w-[100%] h-auto sm:h-[50px] flex flex-col items-center justify-center">
            <div className="flex flex-row items-center  w-[100%]">
              <div className="px-2 w-full flex flex-col gap-1">
                <div className="text-sm text-[#615E83]">
                  <div className="flex flex-row items-center justify-between w-[100%]">
                    <div className="text-[#121212] font-bold text-[13px] ">
                      Storage used:
                    </div>
                    <div className="text-[#121212] text-[12px]  w-[30%]">
                      4646
                    </div>
                    <div className="text-[#121212] text-[12px] w-[50%] justify-end flex">
                      10 GB
                    </div>
                  </div>
                </div>
                <div className="w-full h-3 mt-2 relative overflow-hidden min-w-[100px] bg-white rounded-full">
                  <div className="absolute top-0 left-0 rounded-r-xl z-10 bg-[#08A0F7] h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-auto mt-2  text-[#5A5A5A] text-[14px] scrollbar-hide h-full bg-white rounded-lg w-[100%] flex flex-col items-center">
          <div className="w-full h-[50px] flex flex-row px-5 sm:px-2  justify-between items-center ">
            <div className=" h-[100%] flex justify-between items-center">
              <div className="text-[#1e1e1e] text-[14px] sm:ml-4 font-semibold">
                Files uploaded
              </div>
            </div>
            <div className="space-x-3 h-[100%] flex flex-row items-center justify-evenly">
              <div className="p-2 sm:mr-5 flex flex-row rounded-xl border-2 text-[12px] text-white bg-[#FFC248] border-[#FFC248] justify-evenly items-center font-semibold">
                <CloudUpload size={15} />
                <div className=" mx-2 pn:max-sm:hidden ">Upload</div>
              </div>
            </div>
          </div>

          {/* File List */}
          <div className="flex flex-row pn:max-sm:hidden w-[100%] h-[50px] items-center justify-evenly font-bold">
            <div className="flex items-center sm:w-[30%] w-[60%] text-left ml-4">
              File Name
            </div>
            <div className="flex items-center sm:w-[20%] w-[20%] text-left">
              File Size
            </div>
            <div className="flex items-center sm:w-[20%] w-[20%] text-left">
              Date Uploaded
            </div>
            <div className="flex items-center sm:w-[20%] w-[20%] text-left">
              Uploaded By
            </div>
            <div className="flex items-center sm:w-[10%] w-[20%] text-left ">
              Actions
            </div>
          </div>
          <>
            <div
              className={`flex flex-row justify-evenly items-center w-full border-b-[1px] border-gray-200 h-[50px] text-center text-[#1E1E1E] `}
            >
              <div className="sm:w-[30%] w-[60%] text-left ml-4">hjk</div>
              <div className="sm:w-[20%] w-[20%] text-left">ghj</div>
              <div className="sm:w-[20%] w-[20%] text-left">fghjk</div>
              <div className="sm:w-[20%] w-[20%] text-left">fghjk</div>
              <div className="sm:w-[10%] w-[20%] text-left">
                <div className="flex flex-row gap-1 sm:gap-3 text-left ">
                  <MdDeleteOutline className="text-[18px] cursor-pointer text-[#F13E3E]" />

                  <div className="text-[18px] cursor-pointer text-blue-600">
                    <HiDownload />
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default page;
