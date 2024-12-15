import React from "react";
import { BsChatSquare, BsPlus } from "react-icons/bs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserProfile from "@/app/components/UserProfile";
import Link from "next/link";

const Members = ({ members }: { members: any }) => {
  return (
    <div className="flex bg-white rounded-xl flex-col">
      <div className="flex justify-between p-4 border-b items-center w-full">
        <div className="font-semibold text-[17px]">Members List</div>
        <div className="flex justify-center items-center gap-4">
          {/* <div className="border border-[#EAEEF4] p-2 rounded-full">
                <RiSearch2Line />
              </div> */}
          <div className="flex justify-center items-center gap-1">
            <button className="flex justify-center items-center gap-1 text-white text-xs sm:text-sm p-2 px-4 rounded-[10px] bg-[#FFC248]">
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
          {members.length > 0 ? (
            <>
              {members.map((d: any, index: number) => (
                <TableRow key={index} className="h-[65px]">
                  <TableCell className="w-[200px] font-medium px-4">
                    <UserProfile
                      userName={d?.fullname ? d?.fullname : ""}
                      userPic={d?.profilepic ? d?.profilepic : ""}
                      paraText={d?.email ? d?.email : ""}
                    />
                  </TableCell>
                  <TableCell className="w-[130px] px-4">Paid</TableCell>
                  <TableCell className="w-[130px] px-4">Credit Card</TableCell>
                  <TableCell className="w-[130px] px-4">$250.00</TableCell>
                  <TableCell className="w-[130px] px-4">
                    <Link href={`/chats/${d?.id}`}>
                      <BsChatSquare />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center h-[300px] font-semibold text-gray-500"
              >
                No member exists.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Members;
