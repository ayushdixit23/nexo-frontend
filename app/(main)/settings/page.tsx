"use client";
import { useAuthContext } from "@/app/(utilities)/utils/auth";
import React from "react";
import SettingLayout from "./components/SettingLayout";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { setTimeout } from "timers";
import AccountSettings from "./components/AccountSettings";
import useGetWindowSize from "@/app/(utilities)/hooks/useGetWindowSize";

const page = () => {
  const { data, setData, setAuth } = useAuthContext();
  const params = useSearchParams();
  const type = params.get("type");
  const isMobileView = useGetWindowSize();
  const router = useRouter();

  const handleLogOut = () => {
    let timeoutId: any;
    try {
      Cookies.remove("token");
      localStorage.removeItem("organisationId");
      timeoutId = setTimeout(() => {
        setAuth(false);
        setData(null);
      }, 3000);

      toast.success("Logged Out Successfully");
      router.push("/login");

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong! Please Try Again");
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="bg-white rounded-xl w-full p-3 sm:py-5 text-lg sm:text-xl font-semibold sm:px-4">
        Account Settings
      </div>
      <div className="flex w-full gap-5">
        <div
          className={`md:w-[28%] sm:w-[35%] w-full ${isMobileView && type && "hidden"}`}
        >
          <SettingLayout data={data} handleLogOut={handleLogOut} />
        </div>

        <div
          className={`md:w-[72%] sm:w-[65%] ${
            isMobileView && !type && "pn:max-sm:hidden"
          } w-full rounded-xl flex bg-white justify-center items-center p-4 h-full`}
        >
          {(type === "editProfile" || !type) && (
            <AccountSettings
              data={data}
              // @ts-ignore
              setData={setData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
