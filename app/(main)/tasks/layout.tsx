"use client";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import { API } from "@/app/(utilities)/utils/config";
import { errorHandler, formatDate } from "@/app/(utilities)/utils/helpers";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { RiSearch2Line } from "react-icons/ri";
import { RxCrossCircled } from "react-icons/rx";
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
        assignedTeams: selectedTeams
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
    // Fetch tasks when the component mounts

    if (data?.id && data?.organisationId) {
      fetchTasks();
    }
  }, []);

  return (
    <>
      {isMytasks && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <div className="md:w-[30%] flex shadow-md flex-col gap-5 bg-white p-4 rounded-xl h-auto">
            <div className="flex justify-between py-1 items-center w-full">
              <div className="text-[#121212] font-semibold">Add New Task</div>
              <div
                className="cursor-pointer"
                onClick={() => setIsMytasks(false)}
              >
                <RxCrossCircled className="text-xl text-black" />
              </div>
            </div>
            <div>
              <textarea
                name=""
                cols={30}
                rows={10}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full min-h-[150px] h-[150px] max-h-[200px] rounded-xl border p-2 text-sm border-[#FFC977] shadow-md outline-none"
                id=""
              ></textarea>
            </div>
            <div className="flex justify-center items-center font-medium gap-3 text-sm">
              <button
                onClick={() => setIsMytasks(false)}
                className="text-center p-3 px-5 rounded-full w-full border "
              >
                Cancel
              </button>
              <button
                onClick={sendIndividualTask}
                className="text-center p-3 px-5 rounded-full w-full bg-[#FFC248]"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}

      {teamTasks && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <div className="flex sm:flex-row flex-col shadow-md gap-3 bg-[#FAF9F6] p-3 rounded-xl h-auto">
            <div className="flex min-w-[300px] pn:max-sm:order-2 bg-white p-4 flex-col gap-5 rounded-xl">
              <div className="flex justify-between py-1 items-center w-full">
                <div className="text-[#121212] font-semibold">Add New Task</div>
                <div
                  className="cursor-pointer"
                  onClick={() => setTeamTasks(false)}
                >
                  <RxCrossCircled className="text-xl text-black" />
                </div>
              </div>
              <div>
                <textarea
                  name=""
                  cols={30}
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  rows={10}
                  className="w-full min-h-[150px] h-[150px] max-h-[200px] rounded-xl border p-2 text-sm border-[#FFC977] shadow-md outline-none"
                  id=""
                ></textarea>
              </div>
              <div className="flex justify-center items-center font-medium gap-3 text-sm">
                <button
                  onClick={() => {
                    setTask("");
                    setTeamTasks(false);
                    setSelectedTeams([]);
                  }}
                  className="text-center p-3 px-5 rounded-full w-full border "
                >
                  Cancel
                </button>
                <button
                  onClick={sendTeamTask}
                  className="text-center p-3 px-5 rounded-full w-full bg-[#FFC248]"
                >
                  Save Task
                </button>
              </div>
            </div>

            <div className=" flex min-w-[300px] pn:max-sm:order-1 flex-col gap-3 h-auto">
              <div className="flex p-4 rounded-xl bg-white items-center gap-2">
                <MdOutlinePersonAddAlt1 />
                <div>Assign task to</div>
              </div>
              <div className="flex flex-col gap-4 justify-center p-4 px-3 rounded-xl bg-white items-center">
                <div className="flex rounded-xl text-[12px] w-full bg-[#FFF8EB] items-center p-2">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent outline-none px-1  text-black text-sm"
                  />
                  <RiSearch2Line className="text-black text-[20px] mr-2" />
                </div>
                <div className="w-full flex mt-2 flex-col gap-5 overflow-y-scroll no-scrollbar max-h-[150px]">
                  <>
                    {teams.length > 0 ? (
                      <>
                        {teams?.map((team, index) => {
                          return (
                            <div
                              onClick={() => handleTeamIdAddition(team.id)}
                              className={`rounded-xl ${
                                selectedTeams.includes(team.id)
                                  ? "bg-[#FFC977]"
                                  : "bg-white"
                              } flex justify-between items-center`}
                              key={index}
                            >
                              <div className="flex py-2 px-3 items-center gap-1">
                                <div className="flex items-center gap-3">
                                  <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full bg-yellow-500 overflow-hidden">
                                    <div className="text-white font-semibold">
                                      {team?.name.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-0.5">
                                  <div className="text-sm font-semibold">
                                    {team.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center items-center w-full h-full">
                          <div className="w-[90%] flex flex-col justify-center items-center">
                            <div className="flex justify-center items-center gap-3">
                              <div className=" font-semibold">
                                No Teams Found{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>

                  {/* <div className="flex w-full items-center gap-3">
                    <div className="w-[40px] h-[40px] overflow-hidden">
                      <Image
                        className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
                        src={data?.profilepic ? data?.profilepic : ""}
                        alt={data?.fullname ? data?.fullname : ""}
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="text-sm font-semibold">
                      {data?.fullname}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
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
