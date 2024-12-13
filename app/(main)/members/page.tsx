"use client";
import React, { useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { BsChatSquare, BsPlus } from "react-icons/bs";
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
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import axios from "axios";
import { API } from "@/app/(utilities)/utils/config";
import toast from "react-hot-toast";
import Link from "next/link";

interface Members {
  fullname: string;
  profilepic: string;
  id: string;
  email: string;
}

interface Teams {
  id: string;
  name: string;
  creator: {
    fullname: string | undefined;
    profilepic: string | undefined;
    id: string | undefined;
  };
  members: {
    fullname: string;
    profilepic: string;
    id: string;
  }[];
}

const page = () => {
  const { data } = useAuthContext();
  const [teamPopUp, setTeamPopUp] = useState(false);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [members, setMembers] = useState<Members[]>([]);
  const [teams, setTeams] = useState<Teams[]>([]);
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const myTeam = {
        id: Date.now().toString(),
        name: teamName,
        creator: {
          fullname: data?.fullname,
          profilepic: data?.profilepic,
          id: data?.id,
        },
        members: [],
      };
      setTeams((prevData) => [...prevData, myTeam]);
      const res = await axios.post(
        `${API}/createTeam/${data?.id}/${data?.organisationId}`,
        {
          name: teamName,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setTeamName("");

        const updatedTeam = { ...myTeam, id: res.data.teamId }; // Replace temp ID with actual team ID

        setTeams((prevData) =>
          prevData.map((team) => (team.id === myTeam.id ? updatedTeam : team))
        );
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setTeamPopUp(false);
      setIsCreating(false);
    }
  };

  const handleFetchMembersAndTeams = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${API}/fetchMembersAndTeams/${data?.organisationId}`
      );
      if (res.data.success) {
        console.log(res.data.data);
        setTeams(res.data.data.teams || []);
        setMembers(res.data.data.members || []);
        setIsLoading(false);
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    if (!data?.organisationId) {
      return;
    }
    handleFetchMembersAndTeams();
  }, [data?.organisationId]);

  return (
    <>
      {teamPopUp && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <div className="md:w-[30%] flex shadow-md flex-col gap-6 bg-white p-4 rounded-xl h-auto">
            <div className="font-bold">Create Team</div>
            <div className="flex flex-col">
              <div className="font-semibold text-[#3A3D46] text-xs uppercase">
                Team name
              </div>
              <div>
                <input
                  type="text"
                  name="fullname"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full text-sm py-2 border-b border-gray-300 outline-none "
                />
              </div>
            </div>
            <div className="flex justify-center items-center font-medium gap-3 text-sm">
              <button
                onClick={() => setTeamPopUp(false)}
                className="text-center p-2 px-4 rounded-lg w-full border "
              >
                Cancel
              </button>
              <button
                disabled={isCreating}
                onClick={handleCreateTeam}
                className="text-center p-2 px-4 rounded-lg text-white w-full bg-[#E48700]"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
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
              {members.length > 0 ? (
                <>
                  {members.map((d, index) => (
                    <TableRow key={index} className="h-[65px]">
                      <TableCell className="w-[200px] font-medium px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-[40px] h-[40px] overflow-hidden">
                            <Image
                              className="w-full h-full object-cover shadow-sm rounded-full"
                              src={d.profilepic}
                              width={40}
                              height={40}
                              alt={d.fullname}
                            />
                          </div>

                          <div className="space-y-0.5">
                            <div className="text-sm font-semibold">
                              {d?.fullname}
                            </div>

                            <p className="text-xs font-medium text-muted-foreground">
                              {d?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[130px] px-4">Paid</TableCell>
                      <TableCell className="w-[130px] px-4">
                        Credit Card
                      </TableCell>
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

        {/* teams list */}
        <div className="flex bg-white rounded-xl flex-col">
          <div className="flex justify-between p-4 border-b items-center w-full">
            <div className="font-semibold text-[17px]">Teams List</div>
            <div className="flex justify-center items-center gap-4">
              <div className="border border-[#EAEEF4] p-2 rounded-full">
                <RiSearch2Line />
              </div>
              <div className="flex justify-center items-center gap-1">
                <button
                  onClick={() => setTeamPopUp(true)}
                  className="flex justify-center items-center gap-1 text-white text-sm p-2 px-4 rounded-[10px] bg-[#FFC248]"
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
                  {teams.map((d, index) => (
                    <TableRow key={index} className="h-[65px]">
                      <TableCell className="w-[200px] font-medium px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full bg-yellow-500 overflow-hidden">
                            <div className="text-white font-semibold">
                              {d?.name.charAt(0).toUpperCase()}
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <div className="text-sm font-semibold">
                              {d?.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[130px] px-4">Paid</TableCell>
                      <TableCell className="w-[130px] px-4">
                        Credit Card
                      </TableCell>
                      <TableCell className="w-[130px] px-4">$250.00</TableCell>
                      <TableCell className="w-[130px] px-4">
                        <Link href={`/chats/teams/${d?.id}`}>
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
                    No team exists.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default page;
