import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BsChatSquare, BsPlus } from "react-icons/bs";
import Link from "next/link";

const TeamList = ({
  teams,
  setAddMembersPopup,
  setSelectedTeam,
  data,
  setTeamPopUp,
}: {
  teams: any;
  setAddMembersPopup: any;
  setSelectedTeam: any;
  data: any;
  setTeamPopUp: any;
}) => {
  return (
    <div className="flex bg-white rounded-xl flex-col">
      <div className="flex justify-between p-4 border-b items-center w-full">
        <div className="font-semibold text-[17px]">Teams List</div>
        <div className="flex justify-center items-center gap-4">
          {/* <div className="border border-[#EAEEF4] p-2 rounded-full">
          <RiSearch2Line />
        </div> */}
          <div className="flex justify-center items-center gap-1">
            <button
              onClick={() => setTeamPopUp(true)}
              className="flex justify-center items-center gap-1 text-white text-xs sm:text-sm p-2 px-4 rounded-[10px] bg-[#FFC248]"
            >
              <BsPlus className="text-xl" />

              <div>Create Team</div>
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
          {teams.length > 0 ? (
            <>
              {teams.map((d: any, index: number) => (
                <TableRow key={index} className="h-[65px]">
                  <TableCell className="w-[200px] font-medium px-4">
                    <div className="flex items-center gap-3">
                      <div className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] flex justify-center items-center rounded-full bg-yellow-500 overflow-hidden">
                        <div className="text-white w-full h-full flex justify-center items-center font-semibold">
                          {d?.name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold">{d?.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[130px] px-4">Paid</TableCell>
                  <TableCell className="w-[130px] px-4">Credit Card</TableCell>
                  <TableCell className="w-[130px] px-4">$250.00</TableCell>
                  <TableCell className="w-[130px] px-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/chats/teams/${d?.id}`}>
                        <BsChatSquare />
                      </Link>

                      <button
                        className="text-sm py-1 px-4 border bg-white font-medium rounded-xl text-black transition duration-150"
                        onClick={() => {
                          setAddMembersPopup(true);
                          setSelectedTeam({
                            id: d?.id,
                            name: d?.name,
                            // @ts-ignore
                            members: [...d?.members, ...members].filter(
                              (member, index, self) =>
                                index ===
                                self.findIndex((m) => m.id === member.id)
                            ),
                            // @ts-ignore
                            creator: d?.creator,
                          });
                        }}
                      >
                        {d?.creator.id === data?.id ? "Add" : "View"}
                      </button>
                    </div>
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
                No team exists.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamList;
