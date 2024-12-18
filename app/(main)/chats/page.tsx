"use client";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import notasks from "../../assets/no-tasks.png";
import { FaTasks } from "react-icons/fa";
import Link from "next/link";
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import { API } from "@/app/(utilities)/utils/config";
import axios from "axios";
import NoComponent from "@/app/components/NoComponent";
import UserProfile from "@/app/components/UserProfile";
import ShimmerLoader from "../tasks/components/Shimmer";

interface Data {
  id: string; // conversation._id is likely a string (ObjectId.toString())
  user: {
    id: string;
    fullname: string; // fullname can be undefined if not found
    profilepic: string; // assuming addProfilePicURL returns a string
  };
  lastMessage:
    | {
        message: string | null;
        createdAt: string | null; // createdAt is usually a string or Date
      }
    | "Start a conversation";
  createdAt: string; // conversation.createdAt is typically a string or Date
}

const page = () => {
  const { data } = useAuthContext();
  const [users, setUsers] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllConversationsOfUser = async () => {
    try {
      const res = await axios.get(
        `${API}/fetchAllConversationsOfUser/${data?.id}`
      );
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data?.id) {
      fetchAllConversationsOfUser();
    }
  }, [data?.id]);

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
          {users.length > 0 ? (
            <>
              {users?.map((d, index) => {
                return (
                  <Link
                    href={`/chats/${d?.user.id}`}
                    className="p-5 rounded-xl bg-white"
                    key={index}
                  >
                    <UserProfile
                      userName={d?.user.fullname ? d?.user.fullname : ""}
                      userPic={d?.user.profilepic ? d?.user.profilepic : ""}
                      paraText={
                        typeof d?.lastMessage === "object" &&
                        d?.lastMessage !== null
                          ? d?.lastMessage.message || "Start a conversation"
                          : "Start a conversation"
                      }
                    />
                  </Link>
                );
              })}
            </>
          ) : (
            <>
              <div className="flex justify-center items-center w-full h-full">
                <NoComponent src={notasks} text={"No Chats Found"} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default page;
