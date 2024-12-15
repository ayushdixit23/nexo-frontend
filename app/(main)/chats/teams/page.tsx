"use client";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import notasks from "../../../assets/no-tasks.png";
import { FaTasks } from "react-icons/fa";
import Link from "next/link";
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import axios from "axios";
import { API } from "@/app/(utilities)/utils/config";
import toast from "react-hot-toast";
import NoComponent from "@/app/components/NoComponent";
import ShimmerLoader from "../../tasks/components/Shimmer";

// Define the TeamMember interface for each member
interface TeamMember {
  id: string; // Member's ID (could be the ObjectId in string format)
  fullname: string; // Member's full name
  profilepic: string; // Profile picture URL (or path)
  email: string; // Member's email
}

// Define the Teams interface
interface Teams {
  id: string; // Team ID
  name: string; // Team name
  lastMessage:
    | {
        message: string | undefined; // Last message content
        createdAt: Date; // Timestamp
      }
    | "Start a conversation"; // Last message sent
  organisation: string; // Organisation ID as string (ObjectId in MongoDB is stored as a string)
  creator: string; // Creator ID (ObjectId in MongoDB)
  createdAt?: Date; // Optional: Timestamp when the team was created
  updatedAt?: Date; // Optional: Timestamp when the team was last updated
  members: TeamMember[]; // Array of TeamMember objects
}

const page = () => {
  const { data } = useAuthContext();
  const [teams, setTeams] = useState<Teams[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await axios.get(
        `${API}/fetchTeams/${data?.id}/${data?.organisationId}`
      );
      if (res.data.success) {
        setTeams(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(teams);

  useEffect(() => {
    if (data?.id) {
      fetchTeams();
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-5 w-full h-[100%]">
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <ShimmerLoader
            key={index}
            className="bg-white flex flex-col gap-4 p-3 sm:p-4 rounded-xl"
            hide={true}
          />
        ))
      ) : (
        <>
          {teams.length > 0 ? (
            <>
              {teams?.map((team, index) => {
                return (
                  <Link
                    href={`/chats/teams/${team?.id}`}
                    className="p-5 rounded-xl bg-white"
                    key={index}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full bg-yellow-500 overflow-hidden">
                          <div className="text-white font-semibold">
                            {team?.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold">{team.name}</div>

                        <p className="text-xs font-medium text-muted-foreground">
                          {team.lastMessage?.message
                            ? team.lastMessage?.message
                            : "Start a conversation"}
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
                <NoComponent src={notasks} text="No Teams Found" />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default page;
