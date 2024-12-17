import React from "react";
// import { FcInfo } from 'react-icons/fc'
import { IoInformationCircleOutline } from "react-icons/io5";

const Hover = ({
  text,
  para,
  mobile = "-left-[80px]",
  pc,
  w1 = "w-[250px]",
  w2,
  icon = <IoInformationCircleOutline />,
  color = "dark:bg-[#323d4e] bg-white",
}: {
  text: string;
  para: string;
  mobile?: string;
  pc?: string;
  w1?: string;
  w2?: string;
  icon?: React.ReactNode;
  color?: string;
}) => {
  return (
    <div className="flex items-center gap-1">
      <div>{text}</div>
      <div className="relative group cursor-pointer inline-block">
        {icon}
        <div
          className={`hidden group-hover:block text-[14px] shadow-lg ${w1} ${w2} ${mobile} ${pc} ${color} font-semibold absolute top-0 z-10 mt-[20px]  text-black dark:text-white opacity-0  group-hover:opacity-100 transition p-3 rounded-lg`}
        >
          {para}
        </div>
      </div>
    </div>
  );
};

export default Hover;
// icon = <FcInfo />
