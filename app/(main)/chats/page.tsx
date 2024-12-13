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

  const fetchAllConversationsOfUser = async () => {
    try {
      const res = await axios.get(
        `${API}/fetchAllConversationsOfUser/${data?.id}`
      );
      if (res.data.success) {
        setUsers(res.data.data);
        console.log(res.data);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    if (data?.id) {
      fetchAllConversationsOfUser();
    }
  }, [data?.id]);

  return (
    <div className="flex flex-col gap-5 w-full h-[100%]">
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
                  <div className="flex items-center gap-3">
                    <div className="w-[50px] h-[50px] overflow-hidden">
                      <Image
                        className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
                        src={d?.user.profilepic} // Fallback to a default image if not provided
                        alt={d?.user.fullname} // Fallback to 'User' if no name is provided
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold">
                        {d?.user.fullname}
                      </div>

                      <p className="text-xs font-medium text-muted-foreground">
                        {/* @ts-ignore */}
                        {d.lastMessage.message || "Start a conversation"}
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
              <div className="sm:w-[400px] sm:h-[400px] w-[90%] flex flex-col justify-center items-center">
                <Image
                  src={notasks}
                  alt="notasks"
                  className="w-full h-full object-contain"
                />
                <div className="flex justify-center items-center gap-3">
                  <FaTasks />

                  <div className=" font-semibold">No Chats Found</div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default page;
