import { Team } from "@/app/redux/slices/tasksSlice";
import React from "react";
import ShimmerLoader from "./Shimmer";
import src from "../../../assets/no-tasks.png";
import Tasks from "./Tasks";
import NoComponent from "@/app/components/NoComponent";
import Image from "next/image";

const TeamTasks = ({
  isLoading,
  teams,
}: {
  isLoading?: boolean;
  teams: Team[];
}) => {
  return (
    <>
      <div className="text-sm w-full h-full flex flex-col gap-4">
        <div className="flex flex-col h-full gap-4">
          {isLoading ? (
            Array(3)
              .fill(null)
              .map((_, loadingIndex) => (
                <div
                  key={loadingIndex}
                  className="bg-white w-full p-5 flex flex-col gap-4 rounded-xl h-full"
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-[45px] h-[45px] bg-gray-200 animate-pulse rounded-full`}
                      />
                      <div className="space-y-0.5">
                        <div
                          className={`w-[120px] h-4 bg-gray-200 animate-pulse`}
                        />
                        <div
                          className={`w-[100px] h-3 bg-gray-200 animate-pulse`}
                        />
                      </div>
                    </div>

                    <div className="w-20 bg-gray-300 h-4 animate-pulse rounded-md" />
                  </div>

                  {Array.from({ length: 3 }).map((_, j) => (
                    <ShimmerLoader
                      key={j}
                      className="bg-[#f1f1f1] flex flex-col gap-4 p-4 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ))
          ) : (
            <>
              {teams.length === 0 ? (
                <div className="flex bg-red-700 justify-center items-center h-full">
                  <NoComponent text="No Team found" src={src} />
                </div>
              ) : (
                <>
                  {teams.map((team, index) => (
                    <div
                      key={index}
                      className="bg-white w-full p-5 flex flex-col gap-4 rounded-xl max-h-[600px]"
                    >
                      {console.log(team)}
                      <div className="flex justify-between items-center w-full">
                        <div className="rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full bg-yellow-500 overflow-hidden">
                                <div className="text-white font-semibold">
                                  {team.name.charAt(0).toUpperCase()}
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
                        <div className="flex justify-center items-center">
                          {team?.members.slice(0, 4)?.map((m, y) => (
                            <div
                              style={{
                                marginLeft: `-${y + 10}px`,
                                zIndex: `${y}`,
                              }}
                              key={y}
                              className="w-[32px] h-[32px] "
                            >
                              <Image
                                src={m?.profilepic || ""}
                                width={32}
                                height={32}
                                alt={m?.fullname}
                                className="h-full object-cover rounded-[22px] w-full"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <>
                        {team.tasks.length === 0 ? (
                          <div className="flex justify-center items-center h-[100px]">
                            <div className="text-sm text-[#121212] font-semibold">
                              No tasks found
                            </div>
                          </div>
                        ) : (
                          <div className="overflow-y-scroll flex flex-col gap-4 no-scrollbar max-h-full">
                            {team.tasks?.map((d, newIndex) => (
                              <Tasks
                                d={d}
                                key={newIndex}
                                className={
                                  "bg-[#f1f1f1] flex flex-col gap-4 p-4 rounded-xl"
                                }
                              />
                            ))}
                          </div>
                        )}
                      </>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamTasks;
