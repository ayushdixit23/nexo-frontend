"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import SelfTasks from "../components/SelfTasks";

const page = () => {
  const { mytasks, teams, error, loading } = useSelector(
    (state: RootState) => state.tasks
  );

  return (
    <>
      <div className="flex w-full h-full">
        <SelfTasks mytasks={mytasks} isLoading={loading} />
      </div>
    </>
  );
};

export default page;
