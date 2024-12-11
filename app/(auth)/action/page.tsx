"use client";
import { useAuthContext } from "@/app/(utilities)/utils/AuthUser";
import { API } from "@/app/(utilities)/utils/config";
import FetchOrganisation from "@/app/components/FetchOrganisation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Camera } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrganisationState {
  name: string;
  profilepic: string | File; // Profile pic can be a string (URL) or a File object
}

const page = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [code, setCode] = useState<string>("");
  const { data, setData } = useAuthContext();
  const router = useRouter();
  const [createOrganisation, setCreateOrganisation] =
    useState<OrganisationState>({
      name: "",
      profilepic: "",
    });

  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCreateOrganisation((prevData) => ({
        ...prevData,
        profilepic: file,
      }));
    }
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
    setCode(code);
  };

  useEffect(() => {
    generatecode();
  }, []);

  const handleCreationOrganisation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createOrganisation.name) {
      toast.error("Organisation name is required");
      return;
    }

    if (!createOrganisation.profilepic) {
      toast.error("Organisation logo is required");
      return;
    }

    if (!data?.id) {
      toast.error("Please sign up first!");
      router.push("/signup");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", createOrganisation.name);
      formData.append("profilepic", createOrganisation.profilepic);
      formData.append("code", code);

      const res = await axios.post(
        `${API}/createOrganisation/${data.id}`,
        formData
      );

      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/tasks/mytasks");

        localStorage.setItem("organisationId", res.data.data.organisationId);
        setData(res.data.data);
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      setIsLoading(false);
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
    }
  };

  return (
    <>
      <div className="bg-white flex w-full max-w-[360px] flex-col p-5 rounded-2xl">
        {!type && (
          <div className="w-full flex flex-col justify-center items-center gap-4">
            <Link
              href={"/action?type=createOrganisation"}
              className="bg-[#FFC977] hover:bg-[#FFC977]/80 w-full focus:ring-4 focus:outline-none focus:ring-[#FFC977]/50 font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Create Organisation
            </Link>
            <div className="text-xs flex justify-center items-center font-semibold rounded-2xl text-black">
              OR
            </div>
            <Link
              href={"/action?type=joinOrganisation"}
              className="bg-[#FFC977] hover:bg-[#FFC977]/80 w-full focus:ring-4 focus:outline-none focus:ring-[#FFC977]/50 font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Join Organisation
            </Link>
            <div className="text-xs flex justify-center items-center font-semibold rounded-2xl text-black">
              OR
            </div>
            <button className="bg-[#FFC977] hover:bg-[#FFC977]/80 w-full focus:ring-4 focus:outline-none focus:ring-[#FFC977]/50 font-semibold rounded-lg text-sm px-5 py-2.5 text-center">
              Continue as Individual
            </button>
          </div>
        )}

        {type === "createOrganisation" && (
          <div className="w-full flex flex-col gap-4">
            <div className="text-black text-xl font-semibold">
              Create an Organization
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="imageInput"
                className="relative group cursor-pointer mb-1 flex justify-center"
              >
                <div className="w-[65px] h-[65px] rounded-3xl overflow-hidden flex items-center justify-center border border-[#555555] border-dashed">
                  {createOrganisation.profilepic ? (
                    <img
                      src={
                        typeof createOrganisation.profilepic === "string"
                          ? createOrganisation.profilepic
                          : URL.createObjectURL(createOrganisation.profilepic)
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera />
                  )}
                </div>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {createOrganisation.profilepic && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const imageInput = document.getElementById("imageInput");
                      if (imageInput) {
                        imageInput.click();
                      }
                    }}
                    className="text-xs font-medium underline"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Fullname */}
              <div className="space-y-2 mt-1">
                <Label htmlFor="fullname">Enter Your Organisation Name</Label>
                <div className="relative">
                  <Input
                    id="fullname"
                    value={createOrganisation.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCreateOrganisation((prevData) => ({
                        ...prevData,
                        name: e.target.value,
                      }))
                    }
                    className="peer pe-9"
                    placeholder="Your Organisation Name"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-1">
                <Label htmlFor="code">Generate Code</Label>
                <div className="relative">
                  <Input
                    id="code"
                    disabled
                    value={code}
                    className="peer pe-9"
                    placeholder="Your Organisation Name"
                    type="text"
                  />
                </div>
                <button
                  onClick={generatecode}
                  className="cursor-pointer text-sm mb-2 on hover:text-blue-500"
                >
                  Generate new code
                </button>
              </div>

              <div className="mt-2">
                <Button
                  onClick={handleCreationOrganisation}
                  className="group w-full"
                >
                  {isLoading ? "Creating..." : "Create Organisation"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {type === "joinOrganisation" && (
          <div className="w-full flex flex-col gap-4">
            <div className="text-black text-xl font-semibold">
              Join an Organization
            </div>
            <div>
              <FetchOrganisation id={data?.id} router={router} setUser={setData}/>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default page;
