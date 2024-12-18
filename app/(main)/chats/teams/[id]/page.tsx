"use client";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import { API } from "@/app/(utilities)/utils/config";
import {
  errorHandler,
  groupMessagesByDate,
} from "@/app/(utilities)/utils/helpers";
import { useSocketContext } from "@/app/(utilities)/utils/socket";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Chats from "../../components/Chats";
import ChatsInput from "../../components/ChatsInput";
import { IoMdArrowBack } from "react-icons/io";
import Link from "next/link";
import ShimmerUser from "@/app/components/ShimmerUser";
import { useParams } from "next/navigation";

interface teamData {
  id: string;
  name: string;
  creator: {
    // @ts-ignore
    id: string;
    // @ts-ignore
    fullname: string;
    // @ts-ignore
    profilepic: string;
  };
  members: Members[];
}

interface Members {
  fullname: string;
  profilepic: string;
  id: string;
}

interface Messages {
  convId: string | undefined;
  senderid: {
    id: string | undefined;
    fullname: string;
    profilepic: string;
  };
  receiverid?: {
    id: string | undefined;
    fullname: string;
    profilepic: string | undefined;
  };

  message: string;
  date: Date;
}

const page = () => {
  const { data } = useAuthContext();
  const [message, setMessage] = useState("");
  const params = useParams();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [teamData, setTeamData] = useState<teamData | null>(null);
  const { socket } = useSocketContext();
  const [loading, setLoading] = useState(true);

  const fetchTeamMessages = async () => {
    try {
      const res = await axios.get(`${API}/fetchTeamMessages/${params.id}`);
      if (res.data.success) {
        const groupedMessages = groupMessagesByDate(res.data.data);
        setMessages(groupedMessages);
        setTeamData(res.data.team);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    try {
      // Prepare the message data
      const newMessage = {
        convId: teamData?.id,
        senderid: {
          // @ts-ignore
          id: data?.id,
          // @ts-ignore
          fullname: data?.fullname || "",
          // @ts-ignore
          profilepic: data?.profilepic || "",
        },
        message,
        date: new Date(Date.now()), // Current timestamp for the message
        type: "team", // Since it's a team message
      };

      // Extract the date (YYYY-MM-DD) to group messages by date
      const dateStr = newMessage.date.toISOString().split("T")[0]; // Get the date in 'YYYY-MM-DD' format

      // Update the state with the new message, grouped by date
      setMessages((prevMessages: any) => {
        const updatedMessages = { ...prevMessages }; // Copy previous messages state

        // If the date group doesn't exist, create it
        if (!updatedMessages[dateStr]) {
          updatedMessages[dateStr] = [];
        }

        // Add the new message to the correct date group
        updatedMessages[dateStr].push(newMessage);

        return updatedMessages; // Return the updated state
      });

      // Optionally, send the message via socket to notify the other users
      if (socket) {
        socket.emit("message", newMessage);
      } else {
        toast.error("No internet connection");
      }

      // Clear the input field after sending the message
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket?.emit("join-room", params?.id);
    if (socket) {
      socket?.on("receive-message", (data) => {

        // Group the received message by its date
        const groupedMessage = groupMessagesByDate([data]);

        // Update the state with the grouped message
        setMessages((prevMessages: any) => {
          const updatedMessages = { ...prevMessages };

          // Merge the new grouped messages with the existing ones
          Object.keys(groupedMessage).forEach((dateStr) => {
            if (!updatedMessages[dateStr]) {
              updatedMessages[dateStr] = [];
            }
            updatedMessages[dateStr].push(...groupedMessage[dateStr]);
          });

          return updatedMessages;
        });
      });
    }

    return () => {
      if (socket) {
        socket.emit("leave-room", params?.id);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (data?.id) {
      fetchTeamMessages();
    }
  }, [data?.id]);

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Header */}
      <header className="flex items-center px-2 py-3 sm:p-4 rounded-t-lg bg-white shadow-sm border-b">
        {loading ? (
          <ShimmerUser shimmerStyle="animate-pulse bg-gray-100" />
        ) : (
          <>
            <Link href={"/chats/teams"} className="mr-3 text-2xl">
              <IoMdArrowBack />
            </Link>
            <div className="sm:w-[50px] sm:h-[50px] w-[40px] h-[40px] flex justify-center items-center bg-yellow-500 rounded-full overflow-hidden">
              <div className="text-white font-semibold">
                {teamData?.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="ml-3">
              <h1 className="sm:text-lg font-semibold">{teamData?.name}</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                last seen recently
              </p>
            </div>
          </>
        )}
      </header>

      <Chats data={data} messages={messages} loading={loading} />

      <ChatsInput
        message={message}
        sendMessage={sendMessage}
        setMessage={setMessage}
      />
    </div>
  );
};

export default page;
