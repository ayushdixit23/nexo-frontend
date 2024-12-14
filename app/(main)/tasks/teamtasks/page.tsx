
"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import TeamTasks from "../components/TeamTasks";

const page = () => {
  const { teams, error, loading } = useSelector(
    (state: RootState) => state.tasks
  );

  return (
    <>
      <div className="flex w-full h-full">
        <TeamTasks teams={teams} isLoading={loading} />
      </div>
    </>
  );
};

export default page;
