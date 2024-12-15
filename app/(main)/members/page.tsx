"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import axios from "axios";
import { API } from "@/app/(utilities)/utils/config";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import { IoRemoveSharp } from "react-icons/io5";
import Members from "./components/Members";
import TeamList from "./components/TeamList";

interface Members {
  fullname: string;
  profilepic: string;
  id: string;
  email: string;
  isJoined?: boolean;
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
  const [addMembersPopup, setAddMembersPopup] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState({
    id: "",
    name: "",
    members: [],
    creator: {},
  });
  const [isCreating, setIsCreating] = useState(false);
  const [operation, setOperation] = useState({
    addMembers: [],
    removeMembers: [],
  });

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

  // Toggle function for adding/removing members
  const handleMemberClick = (memberId, isJoined) => {
    const updatedMembers = selectedTeam.members.map((member) => {
      if (member.id === memberId) {
        return { ...member, isJoined };
      }
      return member;
    });

    setSelectedTeam((prevData) => ({
      ...prevData,
      members: updatedMembers,
    }));

    setOperation((prevState) => {
      let addMembers = [...prevState.addMembers];
      let removeMembers = [...prevState.removeMembers];

      // If member is in addMembers, move to removeMembers (show minus to plus)
      if (addMembers.includes(memberId)) {
        addMembers = addMembers.filter((id) => id !== memberId);
        removeMembers.push(memberId);
      }
      // If member is in removeMembers, move to addMembers (show plus to minus)
      else if (removeMembers.includes(memberId)) {
        removeMembers = removeMembers.filter((id) => id !== memberId);
        addMembers.push(memberId);
      }
      // If member is neither in addMembers nor removeMembers, add to addMembers
      else if (isJoined) {
        // If `isJoined` is true, the member should be added initially, show minus
        addMembers.push(memberId);
      } else {
        // Otherwise, show plus to add member
        removeMembers.push(memberId);
      }

      return {
        addMembers,
        removeMembers,
      };
    });
  };

  const handleAddMembers = async () => {
    if (
      operation.addMembers.length === 0 &&
      operation.removeMembers.length === 0
    ) {
      toast.error("No members selected");
      return;
    }
    try {
      setIsCreating(true);
      const res = await axios.post(
        `${API}/addMembers/${data?.id}/${selectedTeam.id}`,
        {
          addMembers: operation.addMembers,
          removeMembers: operation.removeMembers,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        handleFetchMembersAndTeams();
        setSelectedTeam({
          id: "",
          name: "",
          members: [],
          creator: {},
        });
        setOperation({
          addMembers: [],
          removeMembers: [],
        });
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsCreating(false);
      setAddMembersPopup(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      {teamPopUp && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <div className="md:w-[30%] w-[90%] sm:w-[70%] flex shadow-md flex-col gap-6 bg-white p-4 rounded-xl h-auto">
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

      {addMembersPopup && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <div className="md:w-[33%] flex shadow-md flex-col gap-3 bg-white rounded-xl h-auto">
            <div className="flex justify-between border-b items-center p-3 px-4 w-full">
              <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full bg-yellow-500 overflow-hidden">
                  <div className="text-white font-semibold">
                    {selectedTeam?.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-sm font-semibold">
                    {selectedTeam?.name}
                  </div>
                </div>
              </div>
              <div
                onClick={() => setAddMembersPopup(false)}
                className="cursor-pointer text-xl font-semibold"
              >
                <RxCross2 />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm p-1 px-4  font-semibold ">
                Add/Remove Members
              </div>
              <div className="flex flex-col max-h-[200px] overflow-y-scroll no-scrollbar">
                {selectedTeam?.members?.map((member) => (
                  <div
                    className={`flex justify-between w-full border-b p-3 px-4 items-center gap-1`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-[40px] h-[40px] overflow-hidden">
                        <Image
                          className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
                          // @ts-ignore
                          src={member?.profilepic ? member?.profilepic : ""}
                          //@ts-ignore
                          alt={member?.fullname}
                          width={40}
                          height={40}
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold">
                          {/* @ts-ignore */}
                          {member?.fullname}
                        </div>
                        <div className="text-xs text-gray-500">
                          {/* @ts-ignore */}
                          {member?.email}
                        </div>
                      </div>
                    </div>
                    {/* @ts-ignore */}

                    {selectedTeam.creator.id !== member.id && (
                      <div>
                        {selectedTeam.creator.id == data?.id && (
                          <div
                            onClick={() => {
                              const updatedMember = {
                                ...member,
                                isJoined: !member.isJoined, // Flip the `isJoined` value
                              };

                              handleMemberClick(
                                member.id,
                                updatedMember.isJoined
                              );
                            }}
                            className="text-lg font-semibold cursor-pointer"
                          >
                            {/* {member?.isJoined ? <IoRemoveSharp
                          /> : <IoMdAdd />} */}

                            {operation.addMembers.includes(member.id) ||
                            member.isJoined ? (
                              <IoRemoveSharp className="text-red-500" /> // Show minus (remove) if added or isJoined
                            ) : (
                              <IoMdAdd className="text-blue-500" /> // Show plus (add) if removed
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center w-full items-center gap-3 p-2 text-sm">
                <button
                  onClick={() => setAddMembersPopup(false)}
                  className="text-center p-2 px-4 w-full rounded-lg border "
                >
                  Cancel
                </button>
                <button
                  disabled={isCreating}
                  onClick={handleAddMembers}
                  className="p-2 px-4 rounded-lg w-full text-white bg-[#E48700]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full flex flex-col gap-6">
        {/* member list */}
        <Members members={members} />

        {/* teams list */}
        <TeamList
          data={data}
          setAddMembersPopup={setAddMembersPopup}
          setSelectedTeam={setSelectedTeam}
          teams={teams}
          setTeamPopUp={setTeamPopUp}
        />
      </div>
    </>
  );
};

export default page;
