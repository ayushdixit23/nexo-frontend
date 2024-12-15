"use client";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import { API } from "@/app/(utilities)/utils/config";
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  addTask,
  addTeamTask,
  fetchTasksFailure,
  fetchTasksStart,
  fetchTasksSuccess,
  updateTask,
  updateTeamTask,
} from "@/app/redux/slices/tasksSlice";
import MyTaskModal from "./components/MyTaskModal";
import TeamModal from "./components/TeamModal";

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const { data } = useAuthContext();
  const [isMytasks, setIsMytasks] = useState(false);
  const [task, setTask] = useState("");
  const [teamTasks, setTeamTasks] = useState(false);
  const dispatch = useDispatch();
  const [selectedTeams, setSelectedTeams] = useState([]);
  const { teams } = useSelector((state: RootState) => state.tasks);

  const sendIndividualTask = async () => {
    if (task.trim() === "") {
      toast.error("Task cannot be empty");
      return;
    }
    try {
      const taskData = {
        id: "12345",
        text: task,
        createdAt: new Date(),
        creator: {
          id: data?.id || "",
          fullname: data?.fullname || "",
          profilepic: data?.profilepic || "",
          email: data?.email || "",
        },
        status: "pending",
        temporary: true,
        assignedTeams: [],
      };
      dispatch(addTask(taskData));
      const res = await axios.post(`${API}/createIndividualTask/${data?.id}`, {
        task,
        orgId: data?.organisationId,
      });
      if (res.data.success) {
        const taskId = res.data.taskId;

        // After getting the real taskId from the backend, update the task in Redux
        const updatedTaskData = { ...taskData, id: taskId };

        // Dispatch the updated task with the real taskId, replacing the old task
        dispatch(updateTask(updatedTaskData));

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setTask("");
      setIsMytasks(false);
    }
  };

  const sendTeamTask = async () => {
    if (task.trim() === "") {
      toast.error("Task cannot be empty");
      return;
    }
    if (selectedTeams.length === 0) {
      toast.error("Select at least one team");
      return;
    }
    try {
      const taskData = {
        id: "12345",
        text: task,
        createdAt: new Date(),
        creator: {
          id: data?.id || "",
          fullname: data?.fullname || "",
          profilepic: data?.profilepic || "",
          email: data?.email || "",
        },
        status: "pending",
        temporary: true,
        assignedTeams: selectedTeams,
      };
      dispatch(addTeamTask(taskData));
      const res = await axios.post(
        `${API}/createTeamTask/${data?.id}/${data?.organisationId}`,
        {
          task,
          selectedTeams,
        }
      );
      if (res.data.success) {
        const taskId = res.data.taskId;
        const updatedTaskData = { ...taskData, id: taskId, temporary: false };

        // Dispatch the updated task with the real taskId to update the state in Redux
        dispatch(updateTeamTask(updatedTaskData));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setTask("");
      setTeamTasks(false);
      setSelectedTeams([]);
    }
  };

  const handleTeamIdAddition = (id: string) => {
    if (selectedTeams.includes(id)) {
      setSelectedTeams(selectedTeams.filter((teamId) => teamId !== id));
    } else {
      setSelectedTeams([...selectedTeams, id]);
    }
  };

  const fetchTasks = async () => {
    dispatch(fetchTasksStart()); // Dispatch loading state
    try {
      const response = await axios.get(
        `${API}/fetchTasks/${data?.id}/${data?.organisationId}`
      );

      if (response.data.success) {
        dispatch(
          fetchTasksSuccess({
            mytasks: response.data.mytasks,
            teams: response.data.teams,
          })
        ); // Dispatch success with the data
      } else {
        dispatch(fetchTasksFailure("Failed to fetch tasks."));
      }
    } catch (error: any) {
      dispatch(fetchTasksFailure(error.message)); // Dispatch error state
      errorHandler(error);
    }
  };

  useEffect(() => {
    if (data?.id && data?.organisationId) {
      fetchTasks();
    }
  }, []);

  return (
    <>
      {isMytasks && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <MyTaskModal
            sendIndividualTask={sendIndividualTask}
            task={task}
            setTask={setTask}
            setIsMytasks={setIsMytasks}
          />
        </div>
      )}

      {teamTasks && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <TeamModal
            handleTeamIdAddition={handleTeamIdAddition}
            selectedTeams={selectedTeams}
            setSelectedTeams={setSelectedTeams}
            sendTeamTask={sendTeamTask}
            task={task}
            setTask={setTask}
            setTeamTasks={setTeamTasks}
            teams={teams}
          />
        </div>
      )}

      <div className={`flex flex-col gap-6 h-full`}>
        <div className="sm:h-[9%]">
          <div className="flex bg-white rounded-xl justify-between p-3 sm:p-4 border-b items-center w-full">
            <div className="flex justify-center items-center gap-2 sm:gap-6">
              <Link
                href="/tasks/mytasks"
                className={`${
                  path === "/tasks/mytasks" &&
                  "font-semibold border-b-4 border-[#FFC977]"
                } text-[13px] sm:text-[17px] p-2`}
              >
                My Tasks
              </Link>
              <Link
                href="/tasks/teamtasks"
                className={`${
                  path === "/tasks/teamtasks" &&
                  "font-semibold border-b-4 border-[#FFC977]"
                } text-[13px] sm:text-[17px] p-2`}
              >
                Team Tasks
              </Link>
            </div>

            <div className="flex justify-center items-center gap-1">
              <button
                onClick={() => {
                  if (path.startsWith("/tasks/mytasks")) {
                    setIsMytasks(true);
                  }
                  if (path.startsWith("/tasks/teamtasks")) {
                    setTeamTasks(true);
                  }
                }}
                className="flex justify-center items-center gap-1 font-medium text-sm sm:p-3 p-1 sm:px-6 rounded-full bg-[#FFC977]"
              >
                <BsPlus className="text-[21px]" />

                <div className="hidden sm:block">Add New Tasks</div>
              </button>
            </div>
          </div>
        </div>

        <div className="sm:h-[91%] overflow-y-scroll no-scrollbar max-h-full flex justify-center items-center h-full">
          {children}
        </div>
      </div>
    </>
  );
}
