"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import { BsPlus } from "react-icons/bs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdDeleteOutline } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import Image from "next/image";
import { useAuthContext } from "@/app/(utilities)/utils/AuthUser";

const page = () => {
  const { data } = useAuthContext();
  return (
    <>
      <div className="w-full h-full flex flex-col gap-6">
        {/* member list */}
        <div className="flex bg-white rounded-xl flex-col">
          <div className="flex justify-between p-4 border-b items-center w-full">
            <div className="font-semibold text-[17px]">Members List</div>
            <div className="flex justify-center items-center gap-4">
              <div className="border border-[#EAEEF4] p-2 rounded-full">
                <RiSearch2Line />
              </div>
              <div className="flex justify-center items-center gap-1">
                <button className="flex justify-center items-center gap-1 text-white text-sm p-2 px-4 rounded-[10px] bg-[#FFC248]">
                  <BsPlus className="text-xl" />

                  <div>Add Members</div>
                </button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-[#FFF8EB] ">
              <TableRow>
                <TableHead className="w-[100px] px-4 font-semibold text-[#444444]">
                  Name
                </TableHead>
                <TableHead className="px-4 font-semibold text-[#444444]">
                  Role
                </TableHead>
                <TableHead className="px-4 font-semibold text-[#444444]">
                  Create Date
                </TableHead>
                <TableHead className="px-4 font-semibold text-[#444444]">
                  Position
                </TableHead>
                <TableHead className="px-4 font-semibold text-[#444444]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index} className="h-[65px]">
                  <TableCell className="w-[200px] font-medium px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[40px] h-[40px] overflow-hidden">
                        <Image
                          className="w-full h-full object-cover shadow-sm rounded-full"
                          src={data?.profilepic ? data?.profilepic : ""}
                          width={40}
                          height={40}
                          alt={data?.fullname ? data?.fullname : ""}
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold">
                          {data?.fullname}
                        </div>

                        <p className="text-xs font-medium text-muted-foreground">
                          {data?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[130px] px-4">Paid</TableCell>
                  <TableCell className="w-[130px] px-4">Credit Card</TableCell>
                  <TableCell className="w-[130px] px-4">$250.00</TableCell>
                  <TableCell className="w-[130px] px-4">
                    <div className="flex flex-row gap-3 text-left ">
                      <MdDeleteOutline className="text-[18px] cursor-pointer text-[#F13E3E]" />

                      <div className="text-[18px] cursor-pointer text-blue-600">
                        <HiDownload />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* teams list */}
        <div className="flex bg-white rounded-xl flex-col">
          <div className="flex justify-between p-4 border-b items-center w-full">
            <div className="font-semibold text-[17px]">Teams List</div>
            <div className="flex justify-center items-center gap-4">
              <div className="border border-[#EAEEF4] p-2 rounded-full">
                <RiSearch2Line />
              </div>
              <div className="flex justify-center items-center gap-1">
                <button className="flex justify-center items-center gap-1 text-white text-sm p-2 px-4 rounded-[10px] bg-[#FFC248]">
                  <BsPlus className="text-xl" />

                  <div>Add Members</div>
                </button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-[#FFF8EB] ">
              <TableRow>
                <TableHead className="w-[100px] px-4 font-semibold text-[#444444]">
                  Name
                </TableHead>
                <TableHead className="px-4 font-semibold text-[#444444]">
                  Role
                </TableHead>
                <TableHead className="px-4 font-semibold text-[#444444]">
                  Create Date
                </TableHead>
                <TableHead className="px-4 font-semibold text-[#444444]">
                  Position
                </TableHead>
                <TableHead className="px-4 font-semibold text-[#444444]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index} className="h-[65px]">
                  <TableCell className="w-[200px] font-medium px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[40px] h-[40px] overflow-hidden">
                        <Image
                          className="w-full h-full object-cover shadow-sm rounded-full"
                          src={data?.profilepic ? data?.profilepic : ""}
                          width={40}
                          height={40}
                          alt={data?.fullname ? data?.fullname : ""}
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold">
                          {data?.fullname}
                        </div>

                        <p className="text-xs font-medium text-muted-foreground">
                          {data?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[130px] px-4">Paid</TableCell>
                  <TableCell className="w-[130px] px-4">Credit Card</TableCell>
                  <TableCell className="w-[130px] px-4">$250.00</TableCell>
                  <TableCell className="w-[130px] px-4">
                    <div className="flex flex-row gap-3 text-left ">
                      <MdDeleteOutline className="text-[18px] cursor-pointer text-[#F13E3E]" />

                      <div className="text-[18px] cursor-pointer text-blue-600">
                        <HiDownload />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default page;
