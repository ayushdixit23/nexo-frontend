import Image, { StaticImageData } from "next/image";
import React from "react";
import { FaTasks } from "react-icons/fa";

interface NoComponentProps {
  text: string;
  src: string | StaticImageData;
  icon?: React.ReactNode;
}

const NoComponent: React.FC<NoComponentProps> = ({
  text,
  src,
  icon = <FaTasks />,
}) => {
  return (
    <div className="sm:w-[400px] sm:h-[400px] w-[90%] flex flex-col justify-center items-center">
      <Image src={src} alt={text} className="w-full h-full object-contain" />
      <div className="flex justify-center items-center gap-3">
        {icon}

        <div className=" font-semibold">{text}</div>
      </div>
    </div>
  );
};

export default NoComponent;
