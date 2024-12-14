"use client";
import React, { useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import { CloudUpload } from "lucide-react";
import axios from "axios";
import { API } from "@/app/(utilities)/utils/config";
import toast from "react-hot-toast";
import {
  errorHandler,
  formatDate,
  truncatetext,
} from "@/app/(utilities)/utils/helpers";
import { RxCross2 } from "react-icons/rx";
import { IoCloudUpload } from "react-icons/io5";
import Image from "next/image";
import uploadFile from "@/app/(utilities)/utils/uploadfile";
import { useAuthContext } from "@/app/(utilities)/utils/auth";

interface Storage {
  orgid: string | undefined;
  userid: {
    email: string | undefined;
    fullname: string | undefined;
    profilepic: string | undefined;
  };
  filename: string | undefined;
  date: any;
  type: string | undefined;
  size: number;
}

function page() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadpop, setUploadPop] = useState(false);
  const { data } = useAuthContext();
  const [storage, setStorage] = useState<Storage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filestorage, setFilestorage] = useState<number | null>(null);
  const [filteredStorage, setFilteredStorage] = useState(storage); // State for filtered storage

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return; // Check if files is null or empty
    setFile(e.target.files[0]);
  };

  const convertFromBytes = (kilobytes: number) => {
    if (kilobytes >= 1024 * 1024)
      return (kilobytes / (1024 * 1024)).toFixed(2) + " GB";
    if (kilobytes >= 1024) return (kilobytes / 1024).toFixed(2) + " MB";
    if (kilobytes > 0) return kilobytes.toFixed(2) + " KB";
    return "0 KB";
  };

  function convertSize(sizeInBytes: number) {
    const sizeInKB = sizeInBytes / 1000;

    const sizeInMB = sizeInKB / 1000;

    const sizeInGB = sizeInMB / 1000;

    return {
      kb: sizeInKB.toFixed(2),
      mb: sizeInMB.toFixed(2),
      gb: sizeInGB.toFixed(2),
    };
  }

  const calculateWidthPercentage = (fileStorage: number) => {
    const limitInKB = 10 * 1024 * 1024; // 10 GB in KB
    const widthPercentage = (fileStorage / limitInKB) * 100;

    // Ensure width percentage does not exceed 100%
    return Math.min(widthPercentage, 100);
  };

  // Handle file upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Fetch the presigned URL from your backend
      const response = await axios.post(`${API}/generatePresignedUrl`, {
        filename: file.name,
        filetype: file.type,
        orgId: data?.organisationId,
      });
      const { presignedUrl, uploadedFileName } = response.data; // Destructure the presigned URL from the response

      const uploaded = await uploadFile({
        presignedUrl,
        file,
        setProgress,
      });

      if (uploaded) {
        const res = await axios.post(
          `${API}/addStorage/${data?.id}/${data?.organisationId}`,
          {
            size: file.size,
            filename: uploadedFileName,
            filetype: file.type,
          }
        );
        if (res.data.success) {
          const sizeInKb = Number(convertSize(file.size).kb);

          setStorage((prevStorage) => [
            ...prevStorage,
            {
              orgid: data?.organisationId,
              userid: {
                email: data?.email,
                fullname: data?.fullname,
                profilepic: data?.profilepic,
              },
              filename: file.name,
              date: Date.now(),
              type: file.type,
              size: sizeInKb,
            },
          ]);

          setFilteredStorage((prevStorage) => [
            ...prevStorage,
            {
              orgid: data?.organisationId,
              userid: {
                email: data?.email,
                fullname: data?.fullname,
                profilepic: data?.profilepic,
              },
              filename: file.name,
              date: Date.now(),
              type: file.type,
              size: sizeInKb,
            },
          ]);

          if (filestorage) {
            setFilestorage((prev) => (prev || 0) + sizeInKb); // Update filestorage
          }

          toast.success("File uploaded successfully!");
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      }

      setUploadPop(false);
    } catch (error) {
      errorHandler(error);
    } finally {
      setUploading(false);
    }
  };

  const getStorage = async () => {
    setLoading(true)
   
    try {
      const res = await axios.get(
        `${API}/fetchStorage/${data?.organisationId}`
      );
      if (res.data.success) {
        setFilestorage(res.data.storageused);
        setStorage(res.data?.storage);
        setFilteredStorage(res.data?.storage);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      errorHandler(error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getStorage();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      // Reset to original storage list when search is cleared
      setFilteredStorage(storage);
    } else {
      // Filter the storage based on the search term
      const filtered =
        storage &&
        storage.filter(
          (item) => item?.filename?.toLowerCase().includes(term) // Assuming each storage item has a 'name' property
        );
      setFilteredStorage(filtered);
    }
  };

  return (
    <>
      {uploadpop && (
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
      )}

      <div className="w-full h-auto">
        <div className="h-[100%] gap-4 w-full flex flex-col ">
          <div className="sm:h-[60px] h-auto w-full py-2 flex flex-row pn:max-sm:flex-col sm:items-center sm:justify-between">
            <div className="sm:h-[50px] h-auto w-full sm:w-[50%] bg-white sm:mt-6 py-2 flex items-center px-2 text-[12px] rounded-2xl mb-6 text-[#BEBEBE]">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search files"
                className="w-full bg-transparent outline-none px-1 py-2 text-black text-sm"
              />
              <RiSearch2Line className="text-black text-[20px] mr-2" />
            </div>
            {/* Storage used */}
            <div className="w-[45%] pn:max-sm:w-[100%] h-auto sm:h-[50px] flex flex-col items-center justify-center">
              <div className="flex flex-row items-center  w-[100%]">
                <div className="px-2 w-full flex flex-col gap-1">
                  <div className="text-sm text-[#615E83]">
                    <div className="flex flex-row items-center justify-between w-[100%]">
                      <div className="text-[#121212] font-bold text-[13px] ">
                        Storage used:
                      </div>
                      <div className="text-[#121212] text-[12px]  w-[30%]">
                        {filestorage && convertFromBytes(filestorage)}
                      </div>
                      <div className="text-[#121212] text-[12px] w-[50%] justify-end flex">
                        10 GB
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-3 mt-2 relative overflow-hidden min-w-[100px] bg-white rounded-full">
                    <div
                      style={{
                        width: `${
                          filestorage && calculateWidthPercentage(filestorage)
                        }%`,
                      }}
                      className="absolute top-0 left-0 rounded-r-xl bg-[#08A0F7] h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-auto mt-2  text-[#5A5A5A] text-[14px] scrollbar-hide h-full bg-white rounded-lg w-[100%] flex flex-col items-center">
            <div className="w-full h-[50px] flex flex-row px-5 sm:px-2  justify-between items-center ">
              <div className=" h-[100%] flex justify-between items-center">
                <div className="text-[#1e1e1e] text-[14px] sm:ml-4 font-semibold">
                  Files uploaded
                </div>
              </div>
              <div className="space-x-3 h-[100%] flex flex-row items-center justify-evenly">
                <div
                  onClick={() => setUploadPop(true)}
                  className="p-2 sm:mr-5 flex flex-row rounded-xl cursor-pointer border-2 text-[12px] text-white bg-[#FFC248] border-[#FFC248] justify-evenly items-center font-semibold"
                >
                  <CloudUpload size={15} />
                  <div className=" mx-2 pn:max-sm:hidden ">Upload</div>
                </div>
              </div>
            </div>

            {/* File List */}
            <div className="flex flex-row pn:max-sm:hidden w-[100%] h-[50px] items-center justify-evenly font-bold">
              <div className="flex items-center sm:w-[30%] w-[60%] text-left ml-4">
                File Name
              </div>
              <div className="flex items-center sm:w-[20%] w-[20%] text-left">
                File Size
              </div>
              <div className="flex items-center sm:w-[20%] w-[20%] text-left">
                Date Uploaded
              </div>
              <div className="flex items-center sm:w-[20%] w-[20%] text-left">
                Uploaded By
              </div>
              <div className="flex items-center sm:w-[10%] w-[20%] text-left ">
                Actions
              </div>
            </div>

            {loading ? (
                <div className="space-y-4 h-full w-full px-3 pb-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="w-full h-[50px] flex items-center justify-evenly animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                  >
                    <div className="sm:w-[30%] w-[60%] h-8 bg-gray-300 rounded-md"></div>
                    <div className="sm:w-[20%] w-[20%] h-8 bg-gray-300 rounded-md"></div>
                    <div className="sm:w-[20%] w-[20%] h-8 bg-gray-300 rounded-md"></div>
                    <div className="sm:w-[20%] w-[20%] h-8 bg-gray-300 rounded-md"></div>
                    <div className="sm:w-[10%] w-[20%] h-8 bg-gray-300 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredStorage.length > 0 ? (
                  <>
                    {filteredStorage.map((item, index) => (
                      <div
                        key={index}
                        className={`flex flex-row ${
                          index % 2 === 0 ? "bg-[#EAECF0]" : "bg-white"
                        } justify-evenly items-center w-full border-b-[1px] border-gray-200 h-[70px] text-center text-[#1E1E1E] `}
                      >
                        <div className="sm:w-[30%] w-[60%] text-left ml-4">
                          {truncatetext(item.filename || "", 20)}
                        </div>
                        <div className="sm:w-[20%] w-[20%] text-left">
                          {convertFromBytes(item.size)}
                        </div>
                        <div className="sm:w-[20%] w-[20%] text-left">
                          {formatDate(item.date || "")}
                        </div>
                        <div className="sm:w-[20%] md:mr-5 w-[20%] text-left">
                          <div className="flex items-center gap-3">
                            <div className="w-[40px] h-[40px] overflow-hidden">
                              <Image
                                className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
                                src={
                                  item.userid.profilepic
                                    ? item.userid.profilepic
                                    : ""
                                }
                                alt={
                                  item.userid.fullname
                                    ? item.userid.fullname
                                    : ""
                                }
                                width={40}
                                height={40}
                              />
                            </div>

                            <div className="space-y-0.5">
                              <div className="text-sm font-semibold">
                                {item.userid.fullname}
                              </div>

                              <p className="text-xs font-medium text-muted-foreground">
                                {item.userid.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="sm:w-[10%] w-[20%] text-left">
                          <div className="flex flex-row gap-1 sm:gap-3 text-left ">
                            <MdDeleteOutline className="text-[18px] cursor-pointer text-[#F13E3E]" />

                            <div className="text-[18px] cursor-pointer text-blue-600">
                              <HiDownload />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="flex justify-center items-center w-full h-[300px] ">
                      <div className="text-[#1e1e1e] text-[14px] font-semibold">
                        No files uploaded yet
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          
        </div>
      </div>
    </>
  );
}

export default page;
