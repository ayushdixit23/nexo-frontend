import { API } from "@/app/(utilities)/utils/config";
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera, FaPen } from "react-icons/fa";

interface PropsData {
  id: string | undefined;
  profilepic: any;
  email: string | undefined;
  fullname: string | undefined;
}

interface State {
  fullname: string;
  email: string;
  profilepic: string | File;
}

const AccountSettings = ({
  data,
  setData,
}: {
  data: PropsData | null;
  setData: React.Dispatch<React.SetStateAction<PropsData | null>>;
}) => {
  const [state, setState] = useState<State>({
    fullname: data?.fullname || "",
    email: data?.email || "",
    profilepic: data?.profilepic || "",
  });
  const [isDifferent, setIsDifferent] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setState((prevData) => ({
        ...prevData,
        profilepic: file,
      }));
    }
  };

  useEffect(() => {
    if (data) {
      // Check if any parameter differs between `state` and `data`
      const hasDifference =
        state.fullname !== data.fullname ||
        state.email !== data.email ||
        state.profilepic !== data.profilepic;

      setIsDifferent(hasDifference);
    }
  }, [state, data]);

  const cancelChanges = () => {
    if (!isDifferent) {
      return;
    }
    setState({
      fullname: data?.fullname || "",
      email: data?.email || "",
      profilepic: data?.profilepic || "",
    });
  };
  const saveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("fullname", state.fullname);
      formData.append("email", state.email);
      formData.append("profilepic", state.profilepic);
      const res = await axios.post(
        `${API}/updateProfile/${data?.id}`,
        formData
      );
      if (res.data.success) {
        setData({
          id: data?.id,
          fullname: state.fullname,
          email: state.email,
          profilepic:
            typeof state.profilepic === "string"
              ? state.profilepic
              : URL.createObjectURL(state.profilepic),
        });
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className="sm:w-[60%] w-full flex justify-center gap-6 items-center flex-col">
      <div className="flex flex-col gap-3">
        <div className="flex justify-center items-center">
          {data?.profilepic ? (
            <label
              htmlFor="settings"
              className="relative light:border max-h-[80px] sm:z-30 rounded-[30px] max-w-[80px]"
            >
              <Image
                className="w-full h-full object-cover min-h-[80px] min-w-[80px] bg-cover rounded-[30px] max-h-[80px] max-w-[80px]"
                src={
                  typeof state.profilepic === "string"
                    ? data?.profilepic
                    : state.profilepic
                    ? URL.createObjectURL(state.profilepic)
                    : ""
                }
                width={80}
                height={80}
                alt={data?.fullname ? data?.fullname : "profile"}
              />
              <div className="absolute -bottom-1 right-1">
                <div className="w-6 h-6 p-1.5 cursor-pointer text-white flex justify-center items-center rounded-full bg-[#5570F1] ">
                  <FaPen />
                </div>
              </div>

              <input
                id="settings"
                name="image"
                accept="image/*"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          ) : (
            <>
              <label
                htmlFor="settings"
                className="w-[80px] relative mb-2 dark:bg-[#323d4e] bg-[#ECECEE] items-center justify-center h-[80px] rounded-[30px] light:border-2 flex flex-col"
              >
                {!state.profilepic ? (
                  <div className=" w-full h-full flex justify-center dark:bg-[#323d4e] bg-[#ECECEE] items-center rounded-[30px]">
                    <div className="flex justify-center flex-col items-center">
                      <FaCamera className="text-2xl" />
                    </div>
                  </div>
                ) : (
                  <>
                    <Image
                      className="w-full h-full object-cover bg-cover rounded-[30px] max-h-[80px] max-w-[80px]"
                      src={
                        typeof state.profilepic == "string"
                          ? ""
                          : URL.createObjectURL(state.profilepic)
                      }
                      alt={data?.fullname ? data?.fullname : "profile"}
                      width={80}
                      height={80}
                    />
                    <div className="absolute -bottom-1 right-1">
                      <div className="w-6 h-6 z-30 cursor-pointer text-white flex justify-center items-center rounded-full bg-[#5570F1] ">
                        <FaPen />
                      </div>
                    </div>
                  </>
                )}
              </label>
              <input
                id="settings"
                name="image"
                accept="image/*"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </>
          )}
        </div>

        <div className="font-semibold text-sm">{data?.fullname}</div>
      </div>
      <div className="w-full flex flex-col mt-3 gap-7">
        <div className="flex flex-col">
          <div className="font-semibold text-xs uppercase">Your Name</div>
          <div>
            <input
              type="text"
              name="fullname"
              value={state.fullname}
              onChange={(e) => setState({ ...state, fullname: e.target.value })}
              className="w-full text-sm py-2 border-b border-gray-300 outline-none "
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="font-semibold text-xs uppercase">your email</div>
          <div>
            <input
              type="text"
              name="email"
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
              className="w-full text-sm py-2 border-b border-gray-300 outline-none "
            />
          </div>
        </div>

        <div className="flex justify-end items-end gap-4 text-sm font-medium">
          <button
            disabled={!isDifferent}
            onClick={cancelChanges}
            className={`text-[#6B7280] bg-[#F1F2F3] ${
              !isDifferent && "opacity-50 cursor-not-allowed"
            } p-2 px-5 rounded-md`}
          >
            Cancel
          </button>
          {isDifferent ? (
            <button
              className="bg-[#FFC977] text-white p-2 px-5 rounded-md"
              onClick={saveChanges}
            >
              Save Changes
            </button>
          ) : (
            <button
              disabled
              className="bg-[#FFC977] opacity-50 cursor-not-allowed text-white p-2 px-5 rounded-md"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
