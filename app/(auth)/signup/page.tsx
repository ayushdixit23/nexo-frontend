"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
// @ts-ignore
import { Mail, Eye, EyeOff, ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { API } from "@/app/(utilities)/utils/config";
import toast from "react-hot-toast";
import { useAuthContext } from "@/app/(utilities)/utils/AuthUser";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { errorHandler } from "@/app/(utilities)/utils/helpers";

interface UserState {
  fullname: string;
  email: string;
  password: string;
  profilepic: string | File; // Profile pic can be a string (URL) or a File object
}

const page = () => {
  const [user, setUser] = useState<UserState>({
    fullname: "",
    email: "",
    password: "",
    profilepic: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setData } = useAuthContext();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUser((prevData) => ({
        ...prevData,
        profilepic: file,
      }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    let timer;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullname", user.fullname);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("profilepic", user.profilepic);

      const res = await axios.post(`${API}/register`, formData);
      if (res.data.success) {
        toast.success(res.data.message);

        const expires = new Date();
        expires.setTime(expires.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days in milliseconds
        Cookies.set("token", res.data.token, { expires });
        
        router.push("/action");
        setData(res.data.data);
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      setIsLoading(false);
      errorHandler(error);
    } finally {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 6000);
    }

    return () => clearTimeout(timer);
  };

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  return (
    <div className="bg-white flex w-full max-w-[360px] flex-col p-5 rounded-2xl">
      <div className="text-[22px] font-semibold">Sign Up</div>

      <div className="flex mt-3 flex-col gap-2">
        <label
          htmlFor="imageInput"
          className="relative group cursor-pointer mb-1 flex justify-center"
        >
          <div className="w-[65px] h-[65px] rounded-3xl overflow-hidden flex items-center justify-center border border-[#555555] border-dashed">
            {user.profilepic ? (
              <img
                src={
                  typeof user.profilepic === "string"
                    ? user.profilepic
                    : URL.createObjectURL(user.profilepic)
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
        {user.profilepic && (
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
        <div className="space-y-2">
          <Label htmlFor="email">Enter Your Fullname</Label>
          <div className="relative">
            <Input
              id="fullname"
              value={user.fullname}
              onChange={(e) => setUser({ ...user, fullname: e.target.value })}
              className="peer pe-9"
              placeholder="Fullname"
              type="text"
            />
          </div>
        </div>
        {/* email */}
        <div className="space-y-2">
          <Label htmlFor="email">Enter Your Email</Label>
          <div className="relative">
            <Input
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="peer pe-9"
              placeholder="Email"
              type="email"
            />
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <Mail size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          </div>
        </div>
        {/* password */}
        <div className="space-y-2">
          <Label htmlFor="password">Enter Your Password</Label>
          <div className="relative">
            <Input
              id="password"
              className="pe-9"
              placeholder="Password"
              type={isVisible ? "text" : "password"}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              aria-describedby="password-strength"
            />
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Eye size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-2">
          <Button onClick={handleSignup} className="group w-full">
            {isLoading ? "Signing up..." : "Sign up"}
            {!isLoading && (
              <ArrowRight
                className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-center font-medium items-center text-sm mt-2">
        <span className="pr-1">Already have an account?</span>
        <Link href="/login" className="underline text-[#e6b162]">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default page;
