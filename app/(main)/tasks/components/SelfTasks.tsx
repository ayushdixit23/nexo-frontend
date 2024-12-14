import { Task } from "@/app/redux/slices/tasksSlice";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";
import ShimmerLoader from "./Shimmer";
import src from "../../../assets/no-tasks.png";
import Tasks from "./Tasks";
import NoComponent from "@/app/components/NoComponent";

const SelfTasks = ({
  mytasks,
  isLoading,
}: {
  mytasks: Task[];
  isLoading?: boolean;
}) => {
  return (
    <>
      <div className="text-sm w-full h-full flex flex-col gap-4">
        <div
          className={`flex ${
            mytasks.length === 0 && "hidden"
          } justify-between font-medium text-[#121212] items-center w-full`}
        >
          <div className="ml-2">Total Tasks : {mytasks.length}</div>
          <div className="flex justify-center items-center gap-2">
            <div className="border border-[#EAEEF4] bg-white p-2 rounded-full">
              <RiSearch2Line />
            </div>
            <div className="flex p-2 px-4 rounded-3xl bg-white justify-center items-center gap-2">
              <div className="text-xs">Sort by Date</div>
              <IoIosArrowDown />
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full gap-4">
          {isLoading ? (
            Array(5)
              .fill(null)
              .map((_, index) => <ShimmerLoader key={index} />)
          ) : (
            <>
              {mytasks.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <NoComponent text="No tasks found" src={src} />
                </div>
              ) : (
                <>
                  {mytasks?.map((d, index) => (
                    <Tasks key={index} d={d} />
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

export default SelfTasks;
