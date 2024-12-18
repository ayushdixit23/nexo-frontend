"use client";
import { errorHandler, formatDate } from "@/app/(utilities)/utils/helpers";
import {
  Task,
  updateStatusTask,
  updateStatusTeamTask,
} from "@/app/redux/slices/tasksSlice";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { FaBolt, FaCheck, FaClock } from "react-icons/fa";
import axios from "axios";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import { API } from "@/app/(utilities)/utils/config";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import UserProfile from "@/app/components/UserProfile";

const Tasks = ({
  d,
  className = "bg-white flex flex-col gap-4 p-4 sm:p-6 rounded-xl",
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
  const { data } = useAuthContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [task, setTask] = React.useState({
    id: d?.id,
    status: d?.status,
  });
  const dispatch = useDispatch();

  const updateTasksStatus = async () => {
    try {
      if (d?.type === "team") {
        dispatch(
          updateStatusTeamTask({
            ...d,
            status: task.status,
          })
        );
      } else {
        dispatch(
          updateStatusTask({
            ...d,
            status: task.status,
          })
        );
      }

      const res = await axios.post(
        `${API}/updateTasksStatus/${task.id}/${data?.id}`,
        {
          status: task.status,
        }
      );

      if (res.data.success) {
        setIsOpen(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <div className="md:w-1/3 w-[90%] pp:w-[70%] rounded-lg shadow-lg bg-white my-3">
            <div className="flex justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <span className="font-semibold text-gray-700 text-lg">
                  Update Task
                </span>
              </div>
              <div>
                <button>
                  <i className="fa fa-times-circle text-red-500 hover:text-red-600 transition duration-150"></i>
                </button>
              </div>
            </div>

            <div className="px-5 pt-4 font-medium text-gray-600">
              Are you sure update this task from {d?.status} to {task.status}?
            </div>

            <div className="px-5 py-4 gap-3 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm py-2 px-5 border bg-white font-medium rounded-sm text-black transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={updateTasksStatus}
                className="text-sm py-2 px-5 bg-red-600 font-medium rounded-sm text-white transition duration-150"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={className}>
        <div className="flex justify-between items-center w-full">
          <UserProfile
            userName={d?.creator.fullname ? d?.creator.fullname : ""}
            userPic={d?.creator.profilepic ? d?.creator.profilepic : ""}
            paraText={d?.creator.email ? d?.creator.email : ""}
          />
          <div>{formatDate(d?.createdAt)}</div>
        </div>
        <div className="flex justify-between p-2 sm:p-4 shadow-custom bg-[#FFF8EB] rounded-lg text-[#252C32] items-center">
          <div className="font-semibold">{d?.text}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="p-1 px-4 text-xs rounded-2xl" variant="outline">
                {d?.status}
                <ChevronDown
                  className="opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl text-xs\">
              <DropdownMenuItem
                onClick={() => {
                  if (d?.status === "pending") {
                    return;
                  }
                  setIsOpen(true);
                  setTask({ id: d?.id, status: "pending" });
                }}
              >
                {getStatusIcon("pending")}
                pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (d?.status === "in progress") {
                    return;
                  }
                  setIsOpen(true);
                  setTask({ id: d?.id, status: "in progress" });
                }}
              >
                {getStatusIcon("in progress")}
                in progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (d?.status === "completed") {
                    return;
                  }
                  setIsOpen(true);
                  setTask({ id: d?.id, status: "completed" });
                }}
              >
                {getStatusIcon("completed")}
                completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default Tasks;
