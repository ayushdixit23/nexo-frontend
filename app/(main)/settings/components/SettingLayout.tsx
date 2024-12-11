import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  data: any;
  handleLogOut: () => void;
}

const SettingLayout = ({ data, handleLogOut }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
          <div className="md:w-1/3 rounded-lg shadow-lg bg-white my-3">
            <div className="flex justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <span className="font-semibold text-gray-700 text-lg">
                  Sign Out
                </span>
              </div>
              <div>
                <button>
                  <i className="fa fa-times-circle text-red-500 hover:text-red-600 transition duration-150"></i>
                </button>
              </div>
            </div>

            <div className="px-5 pt-4 font-medium text-gray-600">
              Are you sure you want to log out?
            </div>

            <div className="px-5 py-4 gap-3 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm py-2 px-5 border bg-white font-medium rounded-sm text-black transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleLogOut}
                className="text-sm py-2 px-5 bg-red-600 font-medium rounded-sm text-white transition duration-150"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-white flex rounded-xl flex-col p-4 h-full">
        <div className="flex bg-[#FAFAFA] flex-1 rounded-xl p-3 justify-center items-center flex-col gap-3 w-full">
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
        <div className="flex flex-col gap-7 w-full text-[#1F2024] mt-5 text-sm font-medium ">
          <Link href={`/settings?type=editProfile`}>Edit Profile</Link>
          <div>Join team</div>
          <div>Share Profile</div>
          <div>All My task</div>
          <div>Language</div>
          <div>Privacy & Security</div>
          <div
            className="cursor-pointer text-red-600"
            onClick={() => setIsOpen(true)}
          >
            Logout
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingLayout;
