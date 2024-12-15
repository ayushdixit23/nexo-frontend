import Image from "next/image";
import React from "react";
import { IoCloudUpload } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const UploadModal = ({
  setUploadPop,
  handleFileChange,
  handleUpload,
  uploading,
  progress,
  file,
  setFile,
}: {
  setUploadPop: React.Dispatch<React.SetStateAction<boolean>>  ;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: (e: React.FormEvent) => Promise<void>;
  uploading: boolean;
  progress: number;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  return (
    <div className="fixed inset-0 bg-[#C0C0C0]/50 flex justify-center items-center">
      <div className="bg-[#FFF8EB] p-4 rounded-xl w-[30%]">
        <div className="flex justify-between">
          <h2 className="text-[15px] text-[#1E1E1E] font-semibold mb-2">
            Upload File Here
          </h2>
          <RxCross2
            onClick={() => {
              setUploadPop(false);
              setFile(null);
            }}
            className="cursor-pointer text-[#F13E3E]"
          />
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border  w-full h-[150px] border-gray-200">
          <div className="flex flex-col items-center justify-center w-full h-full">
            {file ? (
              <div className="text-[13px] flex-col flex justify-center items-center">
                {/* <MdDriveFolderUpload className="text-[20px]"/> */}
                <div className="w-[100px] h-[100px]">
                  <Image
                    src={
                      file.type.split("/")[0] === "image"
                        ? URL.createObjectURL(file)
                        : ""
                    }
                    width={100}
                    height={100}
                    alt={file.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>{file && file.name}</div>
              </div>
            ) : (
              <label
                htmlFor="uploadfile"
                className="w-full h-full cursor-pointer flex items-center justify-center"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <IoCloudUpload className="text-2xl text-gray-400" />
                </div>
              </label>
            )}
          </div>
        </div>
        <input
          type="file"
          id="uploadfile"
          onChange={handleFileChange}
          className="w-full h-[100px] border rounded-md hidden px-2 bg-red-500"
        />
        {file && (
          <button
            disabled={uploading}
            onClick={handleUpload}
            className="rounded-lg bg-[#FFC248] text-white text-sm py-1 px-3 font-bold mt-3"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        )}

        {uploading && (
          <div className="w-full mt-4">
            <div className="bg-gray-200 h-2 rounded-full">
              <div
                className="bg-[#FFC248] h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center text-sm mt-2">
              {Math.round(progress)}%
            </div>
          </div>
        )}
        <p className="text-gray-500 text-[12px] mt-2">
          Max 2 GB files are allowed
        </p>
      </div>
    </div>
  );
};

export default UploadModal;
