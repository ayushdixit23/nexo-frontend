import {
  selectSortedTasks,
  setSortOrder,
  Task,
} from "@/app/redux/slices/tasksSlice";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";
import ShimmerLoader from "./Shimmer";
import src from "../../../assets/no-tasks.png";
import Tasks from "./Tasks";
import NoComponent from "@/app/components/NoComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

const SelfTasks = ({
  mytasks,
  isLoading,
}: {
  mytasks: Task[];
  isLoading?: boolean;
}) => {
  const dispatch = useDispatch();
  const sortedTasks = useSelector(selectSortedTasks);
  const sortOrder = useSelector((state: RootState) => state.tasks.sortOrder);

  const handleSortChange = (sortValue: "old" | "new") => {
    dispatch(setSortOrder(sortValue));
  };

  return (
    <>
      <div className="text-sm w-full h-full flex flex-col gap-4">
        <div
          className={`flex ${
            sortedTasks.length === 0 && "hidden"
          } justify-between font-medium text-[#121212] items-center w-full`}
        >
          <div className="ml-2">Total Tasks : {sortedTasks.length}</div>
          <div className="flex justify-center items-center gap-2">
            {/* <div className="border border-[#EAEEF4] bg-white p-2 rounded-full">
              <RiSearch2Line />
            </div> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex p-2 px-4 rounded-3xl bg-white justify-center items-center gap-2">
                  <div className="text-xs">Sort by Date</div>
                  <IoIosArrowDown />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl">
                <DropdownMenuItem
                  className={`${sortOrder === "new" && "bg-[#f1f1f1]"}`}
                  onClick={() => handleSortChange("new")}
                >
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`${sortOrder === "old" && "bg-[#f1f1f1]"}`}
                  onClick={() => handleSortChange("old")}
                >
                  Oldest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col h-full gap-4">
          {isLoading ? (
            Array(5)
              .fill(null)
              .map((_, index) => <ShimmerLoader key={index} />)
          ) : (
            <>
              {sortedTasks.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <NoComponent text="No tasks found" src={src} />
                </div>
              ) : (
                <>
                  {sortedTasks?.map((d, index) => (
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
