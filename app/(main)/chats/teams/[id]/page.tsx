"use client";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import { API } from "@/app/(utilities)/utils/config";
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import { useSocketContext } from "@/app/(utilities)/utils/socket";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

const page = ({ params }: { params: { id: string } }) => {
  const { data } = useAuthContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [teamData, setTeamData] = useState<teamData | null>(null);
  const { socket } = useSocketContext();

  const fetchTeamMessages = async () => {
    try {
      const res = await axios.get(`${API}/fetchTeamMessages/${params.id}`);
      if (res.data.success) {
        setMessages(res.data.data);
        setTeamData(res.data.team);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    try {
      const dataToPutInState = {
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
        date: new Date(Date.now()),
        type: "team",
      };

      if (socket) {
        socket.emit("message", dataToPutInState);
        setMessages((prevMessages) => [...prevMessages, dataToPutInState]);
        setMessage("");
      } else {
        toast.error("No internet connection");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket?.emit("join-room", params?.id);
    if (socket) {
      socket?.on("receive-message", (data) => {
        console.log(data);
        setMessages((prevMessages) => [...prevMessages, data]);
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
      <header className="flex items-center p-4 rounded-t-lg bg-white shadow-sm border-b">
        <div className="w-[50px] flex justify-center items-center bg-yellow-500 h-[50px] rounded-full overflow-hidden">
          <div className="text-white font-semibold">
            {teamData?.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="ml-3">
          <h1 className="text-lg font-semibold">{teamData?.name}</h1>
          <p className="text-sm text-gray-500">last seen recently</p>
        </div>
        <div className="ml-auto flex space-x-4">
          <button className="text-gray-500 hover:text-gray-700">📞</button>
          <button className="text-gray-500 hover:text-gray-700">🔗</button>
          <button className="text-gray-500 hover:text-gray-700">⋮</button>
        </div>
      </header>

      <main className="flex-grow bg-white p-6 overflow-y-auto">
        <div className="text-center mb-4 text-sm text-gray-500">
          Today, Jun 20
        </div>

        {messages.map((msg, index) => {
          const isSender = msg.senderid.id === data?.id;
          const time = new Date(msg.date).toLocaleTimeString();
          const userName = msg.senderid.fullname;
          const profilePic = msg.senderid.profilepic;

          return (
            <div
              key={index}
              className={`mb-6 ${isSender ? "flex justify-end" : ""}`}
            >
              <div
                className={`flex ${
                  isSender ? "max-w-[60%] space-x-3" : "space-x-3 items-start"
                }`}
              >
                {!isSender && (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={profilePic || ""}
                      alt={userName || ""}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">
                    {userName} · {time}
                  </p>
                  <div
                    className={
                      isSender
                        ? "bg-[#FFC977] w-auto p-3 rounded-lg"
                        : "bg-gray-100 p-3 rounded-lg max-w-[60%]"
                    }
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>

                {isSender && (
                  <div className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full overflow-hidden">
                    <Image
                      src={profilePic || ""}
                      alt={userName || ""}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* Input Box */}
      <footer className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="flex-grow p-2 px-4 rounded-lg outline-none text-sm border border-gray-300"
          />
          <button
            onClick={sendMessage}
            className="bg-[#FFC977] px-6 py-2 text-sm rounded-lg"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default page;
