"use client";
import { useAuthContext } from "@/app/(utilities)/utils/AuthUser";
import { API } from "@/app/(utilities)/utils/config";
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface OtherUser {
  id: string;
  fullname: string;
  profilepic: string;
}

const page = ({ params }: { params: { id: string } }) => {
  const { data } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);

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
      <main className="flex-grow bg-white p-6 overflow-y-auto">
        <div className="text-center mb-4 text-sm text-gray-500">
          Today, Jun 20
        </div>

        <div className="mb-6">
          <div className="flex space-x-3 items-start">
            {/* Profile Picture */}
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={data?.profilepic || ""}
                alt={data?.fullname || ""}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Message Content */}
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
            {/* Message Content */}
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
            {/* Profile Picture */}
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
      </main>

      {/* Input Box */}
      <footer className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Write your message..."
            className="flex-grow p-2 px-4 rounded-lg outline-none text-sm border border-gray-300"
          />
          <button className="bg-[#FFC977] px-6 py-2 text-sm rounded-lg">
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default page;
