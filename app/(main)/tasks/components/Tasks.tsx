"use client";
import { formatDate } from "@/app/(utilities)/utils/helpers";
import { Task } from "@/app/redux/slices/tasksSlice";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bolt, ChevronDown, CopyPlus, Layers2 } from "lucide-react";
import { FaBolt, FaCheck, FaClock } from "react-icons/fa";

const Tasks = ({
  d,
  className = "bg-white flex flex-col gap-4 p-6 rounded-xl",
}: {
  d: Task;
  className?: string;
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaClock size={16} className="opacity-60" />;
      case "in progress":
        return <FaBolt size={16} className="opacity-60" />;
      case "completed":
        return <FaCheck size={16} className="opacity-60" />;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-[45px] h-[45px] overflow-hidden">
            <Image
              className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
              src={d?.creator.profilepic}
              alt={d?.creator.fullname}
              width={45}
              height={45}
            />
          </div>

          <div className="space-y-0.5">
            <div className="text-sm font-semibold">{d?.creator.fullname}</div>

            <p className="text-xs font-medium text-muted-foreground">
              {d?.creator.email}
            </p>
          </div>
        </div>
        <div>{formatDate(d?.createdAt)}</div>
      </div>
      <div className="flex justify-between p-4 shadow-custom bg-[#FFF8EB] rounded-lg text-[#252C32] items-center">
        <div className="font-semibold">{d?.text}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="p-1 px-4 rounded-2xl" variant="outline">
              {d?.status}
              <ChevronDown
                className="opacity-60"
                size={16}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl">
            <DropdownMenuItem>
              {getStatusIcon("pending")}
              pending
            </DropdownMenuItem>
            <DropdownMenuItem>
              {getStatusIcon("in progress")}
              in progress
            </DropdownMenuItem>
            <DropdownMenuItem>
              {getStatusIcon("completed")}
              completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Tasks;
