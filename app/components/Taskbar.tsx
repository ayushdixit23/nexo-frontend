import {
  Bolt,
  DatabaseZap,
  ListChecks,
  MessageSquare,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Taskbar = ({ pathname }: { pathname: string }) => {
  return (
    <div className="fixed z-30 w-[95%] sm:hidden h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {/* Home Button */}
        <Link
          href={"/tasks/mytasks"}
          data-tooltip-target="tooltip-home"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <button
            className={` ${
              pathname.startsWith("/tasks")
                ? "inline-flex items-center text-white justify-center w-10 h-10 font-medium bg-[#f8b75d] rounded-full hover:bg-[#e0a859] group focus:outline-none"
                : ""
            } `}
          >
            <ListChecks size={20} fontStyle={"bold"} />
            <span className="sr-only">Tasks</span>
          </button>
        </Link>

        {/* storage Button */}
        <Link
          href={"/storage"}
          data-tooltip-target="tooltip-wallet"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <button
            className={` ${
              pathname === "/storage"
                ? "inline-flex items-center text-white justify-center w-10 h-10 font-medium bg-[#f8b75d] rounded-full hover:bg-[#e0a859] group focus:outline-none"
                : ""
            } `}
          >
            <DatabaseZap size={20} fontStyle={"bold"} />
            <span className="sr-only">Storage</span>
          </button>
        </Link>

        {/* chats */}
        <Link href={`/chats`} className="flex items-center justify-center">
          <button
            className={` ${
              pathname.startsWith("/chats")
                ? "inline-flex items-center text-white justify-center w-10 h-10 font-medium bg-[#f8b75d] rounded-full hover:bg-[#e0a859] group focus:outline-none"
                : ""
            } `}
          >
            <MessageSquare size={20} fontStyle={"bold"} />
            <span className="sr-only">Chats</span>
          </button>
        </Link>

        {/* Profile Button */}
        <Link
          href={`/members`}
          className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <button
            className={` ${
              pathname === "/members"
                ? "inline-flex items-center text-white justify-center w-10 h-10 font-medium bg-[#f8b75d] rounded-full hover:bg-[#e0a859] group focus:outline-none"
                : ""
            } `}
          >
            <Users size={20} fontStyle={"bold"} />
            <span className="sr-only">Members</span>
          </button>
        </Link>

        {/* Settings Button */}
        <Link
          href={"/settings"}
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <button
            className={` ${
              pathname.startsWith("/settings")
                ? "inline-flex items-center text-white justify-center w-10 h-10 font-medium bg-[#f8b75d] rounded-full hover:bg-[#e0a859] group focus:outline-none"
                : ""
            } `}
          >
            <Bolt size={20} fontStyle={"bold"} />
            <span className="sr-only">Settings</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Taskbar;
