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
import CreateTeam from "./components/CreateTeam";
import AddMemberModal from "./components/AddMemberModal";

export interface Members {
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
  // const [memberPopUp, setMemberPopUp] = useState(false);
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
        <CreateTeam
          setTeamPopUp={setTeamPopUp}
          handleCreateTeam={handleCreateTeam}
          isCreating={isCreating}
        />
      )}

      {addMembersPopup && (
        <AddMemberModal
          data={data}
          handleAddMembers={handleAddMembers}
          handleMemberClick={handleMemberClick}
          isCreating={isCreating}
          operation={operation}
          selectedTeam={selectedTeam}
          setAddMembersPopup={setAddMembersPopup}
        />
      )}

      <div className="w-full h-full flex flex-col gap-6">
        <Members members={members} />

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
