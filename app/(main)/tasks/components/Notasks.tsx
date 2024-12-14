import Image from "next/image";
import React from "react";
import notasks from "../../../assets/no-tasks.png";
import { FaTasks } from "react-icons/fa";

const Notasks = () => {
  return (
    <div className="sm:w-[400px] sm:h-[400px] w-[90%] flex flex-col justify-center items-center">
      <Image
        src={notasks}
        alt="notasks"
        className="w-full h-full object-contain"
      />
      <div className="flex justify-center items-center gap-3">
        <FaTasks />

        <div className=" font-semibold">No tasks found</div>
      </div>
    </div>
  );
};

export default Notasks;
