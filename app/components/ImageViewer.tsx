import Image from "next/image";
import React from "react";
import { RxCross2 } from "react-icons/rx";

const ImageViewer = ({
  src,
  alt,
  setIsClicked,
}: {
  src: string;
  alt: string;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="fixed inset-0 flex z-40 flex-col h-screen bg-black/60 backdrop:blur-md p-4">
      <div className="flex justify-end items-end">
        <RxCross2
          className="text-2xl text-white cursor-pointer"
          onClick={() => setIsClicked(false)}
        />
      </div>
      <div className="h-full flex justify-center items-center">
      <div className="w-[600px] h-[600px]">
        <Image
          src={src}
          alt={alt}
          width={400}
          height={400}
          className="w-full h-full object-contain"
        />
      </div>
      </div>
      
    </div>
  );
};

export default ImageViewer;
