"use client";
import React from "react";
import { useAuthContext } from "../(utilities)/utils/auth";
import {
  Bolt,
  DatabaseZap,
  ListChecks,
  MessageSquare,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UserProfile from "./UserProfile";

const Sidebar = ({ path }: { path: string }) => {
  const { data } = useAuthContext();
  return (
    <>
      <div className="w-full h-full justify-center items-center flex flex-col bg-[#FFFBF3]">
        <div className="h-[95%] w-[95%] flex flex-col justify-between p-4">
          <div className="flex flex-col gap-10">
            <div className="w-full flex items-center">
              <UserProfile
                userName={data?.fullname ? data?.fullname : ""}
                userPic={data?.profilepic ? data?.profilepic : ""}
                paraText={data?.email ? data?.email : ""}
              />
            </div>

            <div className="flex flex-col mt-7">
              <ul className="text-sm flex gap-5 flex-col">
                <Link
                  href={"/tasks/mytasks"}
                  className={`flex ${
                    path.startsWith("/tasks") && "bg-[#FFC977]"
                  } font-semibold rounded-2xl p-4 items-center gap-3`}
                >
                  <div>
                    <ListChecks size={17} fontStyle={"bold"} />
                  </div>
                  <div>Tasks</div>
                </Link>
                <Link
                  href={"/storage"}
                  className={`flex ${
                    path.startsWith("/storage") && "bg-[#FFC977]"
                  } font-semibold rounded-2xl p-4 items-center gap-3`}
                >
                  <div>
                    <DatabaseZap size={17} fontStyle={"bold"} />
                  </div>
                  <div>Storage</div>
                </Link>
                <Link
                  href={"/chats"}
                  className={`flex ${
                    path.startsWith("/chats") && "bg-[#FFC977]"
                  } font-semibold rounded-2xl p-4 items-center gap-3`}
                >
                  <div>
                    <MessageSquare size={17} fontStyle={"bold"} />
                  </div>
                  <div>Chats</div>
                </Link>
                <Link
                  href={"/members"}
                  className={`flex ${
                    path.startsWith("/members") && "bg-[#FFC977]"
                  } font-semibold rounded-2xl p-4 items-center gap-3`}
                >
                  <div>
                    <Users size={17} fontStyle={"bold"} />
                  </div>
                  <div>Members</div>
                </Link>
                <Link
                  href={"/settings"}
                  className={`flex ${
                    path.startsWith("/settings") && "bg-[#FFC977]"
                  } font-semibold rounded-2xl p-4 items-center gap-3`}
                >
                  <div>
                    <Bolt size={17} fontStyle={"bold"} />
                  </div>
                  <div>Settings</div>
                </Link>
              </ul>
            </div>
          </div>
          <div className="text-sm bg-[#FFC977] cursor-pointer w-full text-center p-3 rounded-2xl font-semibold">
            Upgrade To PRO
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
