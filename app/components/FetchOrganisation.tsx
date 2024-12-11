import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../(utilities)/utils/config";
import Image from "next/image";
import { RiSearch2Line } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

interface objectData {
  dp: string;
  name: string;
  id: string;
}

const FetchOrganisation = ({
  id,
  router,
  setUser,
}: {
  id: string | undefined;
  router: AppRouterInstance;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [data, setData] = useState<objectData[]>([]);
  const [allData, setAllData] = useState<Array<objectData> | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [popup, setPopup] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orgId, setOrgId] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${API}/getOrganisations`)
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data || []);
          setAllData(res.data.data || []);
        }
      })
      .catch((err) => {});
  }, []);

  const fetchOrganisation = async (query: string = "") => {
    try {
      if (query.trim() === "") {
        setData(allData || []);
        return;
      }

      const res = await axios.get(`${API}/searchOrganisation`, {
        params: { name: query },
      });
      if (res.data.success) {
        setData(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching organisations:", err);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Adjust debounce delay as needed

    return () => {
      clearTimeout(handler); // Cleanup timeout on query change
    };
  }, [searchQuery]);

  // Trigger fetch on debouncedQuery change
  useEffect(() => {
    fetchOrganisation(debouncedQuery);
  }, [debouncedQuery]);

  const joinOrganisation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!inviteCode) {
      toast.error("Please enter an invitation code");
      setLoading(false);
      return;
    }

    if (!orgId) {
      toast.error("Please select an organisation");
      setLoading(false);
      return;
    }

    if (!id) {
      toast.error("Please sign up first!");
      setLoading(false);
      router.push("/signup");
      return;
    }

    try {
      const res = await axios.post(`${API}/joinOrganisation/${id}/${orgId}`, {
        code: inviteCode,
      });
      if (res.data.success) {
        setLoading(false);
        setPopup(false);
        router.push("/tasks/mytasks");
        toast.success(res.data.message);
        localStorage.setItem("organisationId", res.data.data.organisationId);
        setUser(res.data.data);
      } else {
        setLoading(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Something went wrong");
        } else if (error.request) {
          toast.error("Network error. Please try again later.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("Unexpected error occurred.");
      }
    }finally{
      setLoading(false);
    }
  };

  return (
    <>
      {popup && (
        <div className="flex justify-center items-center h-screen fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 w-full">
          <div
            id="default-modal"
            tabIndex={-1}
            aria-hidden="true"
            className=" "
          >
            <div className="relative p-2 w-[90%] sm:min-w-[450px] max-h-full">
              <div className="relative bg-white rounded-xl shadow ">
                <div className="flex items-center justify-between bg-white p-2 md:p-3 border-b rounded-t-lg ">
                  <h3 className=" font-semibold text-gray-900 ">
                    Enter Organisation Code
                  </h3>
                  <button
                    onClick={() => setPopup(false)}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                    data-modal-hide="default-modal"
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

                <div className="space-y-2 mt-1 w-full p-2 px-3">
                  <Label
                    htmlFor="inviteCode"
                    className="text-[#121212] font-semibold"
                  >
                    Invite Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="inviteCode"
                      disabled={loading}
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="peer pe-9"
                      placeholder="Invite Code"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end p-2 mt-2 rounded-b-lg bg-white ">
                  {loading ? (
                    <div className="text-white bg-[#E48700] rounded-lg p-2 w-[100px] px-5 flex justify-center items-center">
                      <div className="animate-spin">
                        <CgSpinner />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={joinOrganisation}
                      disabled={loading}
                      data-modal-hide="default-modal"
                      type="button"
                      className="text-white bg-[#E48700] hover:bg-white font-medium rounded-lg text-sm px-3 py-2 text-center hover:text-black border border-[#E48700] transition-transform duration-300 ease-in-out transform hover:scale-105"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className=" flex flex-col justify-evenly">
        <div className="flex rounded-xl text-[12px] w-full bg-[#FFF8EB] items-center p-2">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none px-1  text-black text-sm"
          />
          <RiSearch2Line className="text-black text-[20px] mr-2" />
        </div>
        {data?.length === 0 && (
          <div className="flex justify-center items-center p-2 mt-3 bg-[#FFC977] shadow-sm rounded-md">
            <div>No organizations exist</div>
          </div>
        )}

        {data?.length > 0 && (
          <div className="flex flex-col gap-4 justify-center rounded-xl bg-white items-center">
            <div className="w-full flex mt-5 flex-col gap-5 overflow-y-scroll no-scrollbar max-h-[150px]">
              {data.map((d, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-between"
                >
                  <div className="flex w-full items-center gap-3">
                    <div className="w-[40px] h-[40px] overflow-hidden">
                      <Image
                        className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
                        src={d?.dp}
                        alt={d?.name}
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="text-sm font-semibold">{d?.name}</div>
                  </div>

                  <div className="text-[14px] text-blue hover:text-blue-600 shadow-sm">
                    <button
                      onClick={() => {
                        setPopup(true);
                        setOrgId(d.id);
                      }}
                      className="rounded-lg bg-white px-2 border border-gray-300"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FetchOrganisation;
