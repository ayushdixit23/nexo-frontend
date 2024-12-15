"use client";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import { API } from "@/app/(utilities)/utils/config";
import {
  errorHandler,
  groupMessagesByDate,
} from "@/app/(utilities)/utils/helpers";
import { useSocketContext } from "@/app/(utilities)/utils/socket";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChatsInput from "../components/ChatsInput";
import Chats from "../components/Chats";
import ShimmerUser from "@/app/components/ShimmerUser";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import { useParams } from "next/navigation";

interface OtherUser {
  conversationId: string;
  id: string;
  fullname: string;
  profilepic: string;
}

interface Messages {
  convId: string | undefined;
  senderid: {
    id: string | undefined;
    fullname: string;
    profilepic: string;
  };
  receiverid: {
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
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const { socket } = useSocketContext();
  const [loading, setLoading] = useState(true);

  const fetchConversationsMesaages = async () => {
    try {
      const res = await axios.get(
        `${API}/fetchConversationsMesaages/${data?.id}/${params.id}`
      );
      if (res.data.success) {
        const groupedMessages = groupMessagesByDate(res.data.messages);
        setMessages(groupedMessages);
        setOtherUser(res.data.otherUser);
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
        convId: otherUser?.conversationId,
        senderid: {
          // @ts-ignore
          id: data?.id,
          // @ts-ignore
          fullname: data?.fullname || "",
          // @ts-ignore
          profilepic: data?.profilepic || "",
        },
        receiverid: {
          // @ts-ignore
          id: otherUser?.id,
          // @ts-ignore
          fullname: otherUser?.fullname || "",
          // @ts-ignore
          profilepic: otherUser?.profilepic,
        },
        message,
        date: new Date(Date.now()), // Set the current date and time
        type: "user",
      };

      // Group the new message by its date
      const dateStr = newMessage.date.toISOString().split("T")[0]; // Extract the date (YYYY-MM-DD)

      // Check if messages are already grouped
      setMessages((prevMessages: any) => {
        const updatedMessages = { ...prevMessages }; // Make a copy of the previous state

        // If the date group doesn't exist, create it
        if (!updatedMessages[dateStr]) {
          updatedMessages[dateStr] = [];
        }

        // Add the new message to the respective date group
        updatedMessages[dateStr].push(newMessage);

        return updatedMessages; // Return the updated state
      });

      // Optionally send the message via socket (if applicable)
      if (socket) {
        socket.emit("message", newMessage);
      } else {
        toast.error("No internet connection");
      }

      // Clear the message input after sending
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket?.on("receive-message", (data) => {
        console.log(data, "received");

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
  }, [socket]);

  useEffect(() => {
    if (data?.id) {
      fetchConversationsMesaages();
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
            <Link href={"/chats"} className="sm:mr-3 mr-2 text-2xl">
              <IoMdArrowBack />
            </Link>

            <div className="sm:w-[50px] sm:h-[50px] w-[40px] h-[40px] rounded-full overflow-hidden">
              <Image
                src={otherUser?.profilepic || ""} // Replace with profile picture
                alt={otherUser?.fullname || ""}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="ml-3">
              <h1 className="sm:text-lg font-semibold">
                {otherUser?.fullname}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                last seen recently
              </p>
            </div>
          </>
        )}
      </header>

      <Chats data={data} messages={messages} loading={loading} />
      {/* Input Box */}
      <ChatsInput
        message={message}
        sendMessage={sendMessage}
        setMessage={setMessage}
      />
    </div>
  );
};

export default page;
