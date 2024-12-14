import { API } from "@/app/(utilities)/utils/config";
import { errorHandler } from "@/app/(utilities)/utils/helpers";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

interface Props {
  data: any;
  handleLogOut: () => void;
}

const SettingLayout = ({ data, handleLogOut }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [details, setDetails] = React.useState({
    isCreator: false,
    saveCode: "",
    code: "",
    organisationName: "",
  });
  const [popUp, setPopUp] = React.useState(false);

  useEffect(() => {
    if (data?.id && data?.organisationId) {
      fetchSomeDetails();
    }
  }, []);

  const fetchSomeDetails = async () => {
    try {
      const res = await axios.get(
        `${API}/fetchSomeDetails/${data?.id}/${data?.organisationId}`
      );
      console.log(res.data);
      if (res.data.success) {
        if (res.data.isCreator) {
          setDetails({
            isCreator: res.data.isCreator,
            code: res.data.code,
            saveCode: res.data.code,
            organisationName: res.data.name,
          });
        } else {
          setDetails({
            isCreator: res.data.isCreator,
            code: "",
            saveCode: res.data.code,
            organisationName: res.data.name,
          });
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(details.code).then(() => {
      toast.success("Copied!");
    });
  };

  const generatecode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    // Generate a 17-character long code
    for (let i = 0; i < 17; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    // Set the generated code
    setDetails((prevData) => ({
      ...prevData,
      code: code,
    }));
  };

  const handleSaveCode = async () => {
    try {
      const res = await axios.post(
        `${API}/saveCode/${data?.id}/${data?.organisationId}`,
        {
          code: details.code,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setPopUp(false);
    }
  };

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

      {popUp && (
        <div
          id="code"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center w-screen md:inset-0 h-screen max-h-full"
        >
          <div className="relative p-4 flex justify-center items-center w-full max-w-lg max-h-full">
            <div className="relative bg-white dark:bg-[#1A1D21] rounded-lg shadow ">
              <div className="flex items-center border-b w-full justify-between p-3 ">
                <h3 className=" font-semibold text-gray-500 dark:text-white">
                  Your Organisation Code
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setPopUp(false);
                    if (details.code !== details.saveCode) {
                      setDetails({ ...details, code: details.saveCode });
                    }
                  }}
                  className="text-gray-400  hover:dark:bg-gray-400  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center"
                  data-modal-toggle="code"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="px-4 mt-3 pb-4 md:px-5 md:pb-5">
                <label
                  htmlFor="course-url"
                  className="text-sm dark:text-slate-300 font-medium text-gray-900 mb-2 block"
                >
                  Share the code below with your members to allow them to join:
                </label>
                <div className="flex justify-center  items-center dark:bg-bluelight  border rounded-lg bg-transparent border-gray-300 text-gray-500 mb-4">
                  <input
                    id="course-url"
                    type="text"
                    className="col-span-6 rounded-lg  dark:bg-bluelight dark:text-selectdark text-sm  block w-full p-2.5 "
                    value={details.code}
                    disabled
                  />
                  <button
                    onClick={handleCopyToClipboard}
                    data-copy-to-clipboard-target="course-url"
                    data-tooltip-target="tooltip-course-url"
                    className=" p-2 inline-flex items-center justify-center"
                  >
                    <span id="default-icon-course-url">
                      <svg
                        className="w-3.5 h-3.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        {" "}
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id="tooltip-course-url"
                    role="tooltip"
                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip "
                  >
                    <span id="default-tooltip-message-course-url">
                      Copy to clipboard
                    </span>
                    <span
                      id="success-tooltip-message-course-url"
                      className="hidden"
                    >
                      Copied!
                    </span>
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </div>
                <div
                  onClick={generatecode}
                  className="text-sm text-gray-500 -mt-2 cursor-pointer"
                >
                  Generate a new code
                </div>
                <div className="flex justify-center w-full items-center gap-3 mt-2 text-sm">
                  <button
                    onClick={() => {
                      setPopUp(false);
                      if (details.code !== details.saveCode) {
                        setDetails({ ...details, code: details.saveCode });
                      }
                    }}
                    className="text-center p-2 px-4 w-full rounded-lg border "
                  >
                    Cancel
                  </button>
                  <button
                    disabled={details.code === details.saveCode}
                    onClick={handleSaveCode}
                    className={`p-2 px-4 rounded-lg ${
                      details.code === details.saveCode && "opacity-50"
                    } w-full text-white bg-[#E48700]`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
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
          {details.isCreator && (
            <div onClick={() => setPopUp(true)} className="cursor-pointer">
              Organisation Code
            </div>
          )}

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
