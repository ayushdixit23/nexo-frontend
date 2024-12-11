import Image from "next/image";
import React, { useState } from "react";

interface PropsData {
  profilepic: string | undefined;
  fullname: string | undefined;
}

const AccountSettings = ({ data }: { data: PropsData | null }) => {
  const [state, setState] = useState({
    fullname: "",
    email: "",
    password: "",
    profilepic: "",
  });
  return (
    <div className="sm:w-[60%] w-full flex justify-center gap-6 items-center flex-col">
      <div className="flex flex-col gap-3">
        <div className="w-[60px] h-[60px] overflow-hidden">
          <Image
            src={data?.profilepic ? data?.profilepic : ""}
            alt={data?.fullname ? data?.fullname : "profile"}
            className="w-full h-full object-cover rounded-3xl"
            width={60}
            height={60}
          />
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
              name="fullname"
              value={state.fullname}
              onChange={(e) => setState({ ...state, fullname: e.target.value })}
              className="w-full text-sm py-2 border-b border-gray-300 outline-none "
            />
          </div>
        </div>

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

        <div className="flex justify-end items-end gap-4 text-sm font-medium">
          <button
            className="text-[#6B7280] bg-[#F1F2F3] p-2 px-5 rounded-md"
            onClick={() => {}}
          >
            Cancel
          </button>
          <button
            className="bg-[#FFC977] text-white p-2 px-5 rounded-md"
            onClick={() => {}}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
