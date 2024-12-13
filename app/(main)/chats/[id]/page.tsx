"use client";
import { useAuthContext } from "@/app/(utilities)/utils/AuthUser";
import { API } from "@/app/(utilities)/utils/config";
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import { useSocketContext } from "@/app/(utilities)/utils/socket";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

const page = ({ params }: { params: { id: string } }) => {
  const { data } = useAuthContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const { socket } = useSocketContext();

  const fetchConversationsMesaages = async () => {
    try {
      const res = await axios.get(
        `${API}/fetchConversationsMesaages/${data?.id}/${params.id}`
      );
      if (res.data.success) {
        setMessages(res.data.messages);
        setOtherUser(res.data.otherUser);
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
        date: new Date(Date.now()),
        type:"user"
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

  console.log(messages)

  useEffect(() => {
    if (socket) {
      socket?.on("receive-message", (data) => {
        console.log(data, "reveived");
        setMessages((prevMessages) => [...prevMessages, data]);
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
      <header className="flex items-center p-4 rounded-t-lg bg-white shadow-sm border-b">
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
          <Image
            src={otherUser?.profilepic || ""} // Replace with profile picture
            alt={otherUser?.fullname || ""}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="ml-3">
          <h1 className="text-lg font-semibold">{otherUser?.fullname}</h1>
          <p className="text-sm text-gray-500">last seen recently</p>
        </div>
        <div className="ml-auto flex space-x-4">
          <button className="text-gray-500 hover:text-gray-700">📞</button>
          <button className="text-gray-500 hover:text-gray-700">🔗</button>
          <button className="text-gray-500 hover:text-gray-700">⋮</button>
        </div>
      </header>

      {/* Chat Messages */}
      {/* <main className="flex-grow bg-white p-6 overflow-y-auto">
        <div className="text-center mb-4 text-sm text-gray-500">
          Today, Jun 20
        </div>

        <div className="mb-6">
          <div className="flex space-x-3 items-start">
           
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={data?.profilepic || ""}
                alt={data?.fullname || ""}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <p className="text-sm text-gray-500">
                Matthew Anderson · 05:00 pm
              </p>
              <div className="bg-gray-100 p-4 rounded-lg max-w-[60%]">
                <p>
                  Hey there! 👋 I'm new here and I'm really interested in the
                  concept of tokenized real estate. Can anyone explain how it
                  works?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full mb-6">
          <div className="flex max-w-[60%] space-x-3 ">
           
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Matthew Anderson · 05:20 pm
              </p>
              <div className="bg-[#FFC977] w-auto p-4 rounded-lg">
                <p>
                  Hey there! 👋 I'm new here and I'm really interested in the
                  concept of tokenized real estate. Can anyone explain how it
                  works?
                </p>
              </div>
            </div>
           
            <div className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full overflow-hidden">
              <Image
                src={data?.profilepic || ""}
                alt={data?.fullname || ""}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main> */}
      <main className="flex-grow bg-white p-6 overflow-y-auto">
        <div className="text-center mb-4 text-sm text-gray-500">
          Today, Jun 20
        </div>

        {messages.map((msg, index) => {
          const isSender = msg.senderid.id === data?.id; // Replace with actual logic for identifying the sender
          const time = new Date(msg.date).toLocaleTimeString(); // Format time as per your preference
          const userName = msg.senderid.fullname; // Replace with the actual user data
          const profilePic = msg.senderid.profilepic; // Replace with the actual user profile pic URL

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
