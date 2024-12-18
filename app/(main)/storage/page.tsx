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
import uploadFile from "@/app/(utilities)/utils/uploadfile";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import UserProfile from "@/app/components/UserProfile";
import UploadModal from "./components/UploadModal";
import DeleteFile from "./components/DeleteFile";

export interface Storage {
  id: string;
  _id?: string;
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
  const { data, isIndividual } = useAuthContext();
  const [storage, setStorage] = useState<Storage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filestorage, setFilestorage] = useState<number | null>(null);
  const [filteredStorage, setFilteredStorage] = useState(storage); // State for filtered storage
  const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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

  const calculateWidthPercentage = (
    fileStorage: number,
    sizeNumber: number
  ) => {
    const limitInKB = sizeNumber * 1024 * 1024;
    const widthPercentage = (fileStorage / limitInKB) * 100;
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
        isIndividual: isIndividual,
        userId: data?.id,
        orgId: isIndividual ? undefined : data?.organisationId,
      });
      const { presignedUrl, uploadedFileName } = response.data; // Destructure the presigned URL from the response

      const uploaded = await uploadFile({
        presignedUrl,
        file,
        setProgress,
      });

      if (uploaded) {
        const res = await axios.post(`${API}/addStorage/${data?.id}`, {
          orgId: isIndividual ? undefined : data?.organisationId,
          size: file.size,
          filename: uploadedFileName,
          filetype: file.type,
        });
        if (res.data.success) {
          const sizeInKb = Number(convertSize(file.size).kb);

          setStorage((prevStorage) => [
            ...prevStorage,
            {
              _id: res.data.storageId,
              id: res.data.storageId,
              orgid: isIndividual ? undefined : data?.organisationId,
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
              _id: res.data.storageId,
              id: res.data.storageId,
              orgid: isIndividual ? undefined : data?.organisationId,
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
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const getStorageIndividual = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/fetchStorageIndividual/${data?.id}`);
      if (res.data.success) {
        setFilestorage(res.data.storageused);
        setStorage(res.data?.storage);
        setFilteredStorage(res.data?.storage);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data?.organisationId && !isIndividual) {
      getStorage();
    }

    if (data?.id && isIndividual) {
      getStorageIndividual();
    }
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

  const handleOrgainsationDeleteStorage = async () => {
    try {
      const res = await axios.delete(
        `${API}/deleteStorage/${data?.id}/${selectedStorage?.id}/${data?.organisationId}`
      );
      if (res.data.success) {
        setStorage((prevStorage) =>
          prevStorage.filter((item) => item._id !== selectedStorage?.id)
        );
        setFilteredStorage((prevStorage) =>
          prevStorage.filter((item) => item._id !== selectedStorage?.id)
        );
        if (selectedStorage?.size) {
          setFilestorage((prev) => (prev || 0) - selectedStorage?.size);
        }
        toast.success("File deleted successfully!");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSelectedStorage(null);
      setOpenDeleteModal(false);
    }
  };

  const handleDeleteStorage = async () => {
    try {
      if (isIndividual) {
        await handleIndividualDeleteStorage();
      } else {
        await handleOrgainsationDeleteStorage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleIndividualDeleteStorage = async () => {
    try {
      const res = await axios.delete(
        `${API}/deleteStorage/${data?.id}/${selectedStorage?.id}`
      );
      if (res.data.success) {
        setStorage((prevStorage) =>
          prevStorage.filter((item) => item._id !== selectedStorage?.id)
        );
        setFilteredStorage((prevStorage) =>
          prevStorage.filter((item) => item._id !== selectedStorage?.id)
        );
        if (selectedStorage?.size) {
          setFilestorage((prev) => (prev || 0) - selectedStorage?.size);
        }
        toast.success("File deleted successfully!");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSelectedStorage(null);
      setOpenDeleteModal(false);
    }
  };

  const handleDownloadFile = async (id: string, key: string) => {
    try {
      const response = await axios.get(`${API}/generate-download-url/${id}`);
      
      const downloadUrl = response.data.downloadUrl;

      // Trigger the download by creating an anchor tag and clicking it
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = key; // Optional: Set the filename for download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      {uploadpop && (
        <UploadModal
          file={file}
          setFile={setFile}
          uploading={uploading}
          progress={progress}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          setUploadPop={setUploadPop}
        />
      )}

      {openDeleteModal && (
        <DeleteFile
          handleDeleteStorage={handleDeleteStorage}
          selectedStorage={selectedStorage}
          setOpenDeleteModal={setOpenDeleteModal}
        />
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
                        {isIndividual ? "5" : "10"} GB
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-3 mt-2 relative overflow-hidden min-w-[100px] bg-white rounded-full">
                    <div
                      style={{
                        width: `${
                          filestorage &&
                          calculateWidthPercentage(
                            filestorage,
                            isIndividual ? 5 : 10
                          )
                        }%`,
                      }}
                      className="absolute top-0 left-0 rounded-r-xl bg-[#08A0F7] h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" mt-2 text-[#5A5A5A] text-[14px] scrollbar-hide h-full bg-white rounded-lg w-[100%] flex flex-col items-center">
            <div className="w-full flex flex-row px-5 border-b py-3 sm:px-2 justify-between items-center ">
              <div className="h-[100%] flex justify-between items-center">
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
                  <div className="mx-2 pn:max-sm:hidden">Upload</div>
                </div>
              </div>
            </div>

            {/* File Table */}
            <div className="overflow-x-auto max-w-full w-full">
              <table
                className={`w-full table-auto min-w-[900px] ${
                  loading && "border-separate border-spacing-4"
                }`}
              >
                <thead className="h-[60px]">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-[#1E1E1E]">
                      File Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-[#1E1E1E]">
                      File Size
                    </th>

                    <th className="px-4 py-2 text-left text-sm font-semibold text-[#1E1E1E]">
                      Date Uploaded
                    </th>

                    {!isIndividual && (
                      <th className="px-4 py-2 text-left text-sm font-semibold text-[#1E1E1E]">
                        Uploaded By
                      </th>
                    )}
                    <th className="px-4 py-2 text-left text-sm font-semibold text-[#1E1E1E]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(7)].map((_, index) => (
                      <>
                        <tr key={index} className="bg-white">
                          <td
                            colSpan={5}
                            className="px-4 py-3 animate-pulse bg-gray-200 rounded-xl text-center h-[60px] text-[#1e1e1e] text-[14px] font-semibold"
                          ></td>
                        </tr>
                      </>
                    ))
                  ) : filteredStorage.length > 0 ? (
                    filteredStorage.map((item, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-[#EAECF0]" : "bg-white"
                        } border-b-[1px] h-[60px] border-gray-200 text-[#1E1E1E]`}
                      >
                        <td className="px-4 py-3 text-left">
                          {truncatetext(item.filename || "", 20)}
                        </td>
                        <td className="px-4 py-3 text-left">
                          {convertFromBytes(item.size)}
                        </td>
                        <td className="px-4 py-3 text-left">
                          {formatDate(item.date || "")}
                        </td>
                        {!isIndividual && (
                          <td className="px-4 py-3 text-left">
                            <UserProfile
                              userName={
                                item.userid.fullname ? item.userid.fullname : ""
                              }
                              userPic={
                                item.userid.profilepic
                                  ? item.userid.profilepic
                                  : ""
                              }
                              paraText={
                                item.userid.email ? item.userid.email : ""
                              }
                            />
                          </td>
                        )}
                        <td className="px-4 py-3 text-left">
                          <div className="flex gap-2 text-left">
                            <MdDeleteOutline
                              onClick={() => {
                                setSelectedStorage({
                                  ...item,
                                  id: item._id || "",
                                });
                                setOpenDeleteModal(true);
                              }}
                              className="text-[18px] cursor-pointer text-[#F13E3E]"
                            />
                            <div
                              onClick={() =>
                                handleDownloadFile(
                                  item._id || "",
                                  item.filename || ""
                                )
                              }
                              className="text-[18px] cursor-pointer text-blue-600"
                            >
                              <HiDownload />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-center h-[200px] text-[#1e1e1e] text-[14px] font-semibold"
                      >
                        {searchTerm
                          ? "No files found"
                          : "No files uploaded yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
