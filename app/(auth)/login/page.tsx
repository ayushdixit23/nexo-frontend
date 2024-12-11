"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// @ts-ignore
import { Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { API } from "@/app/(utilities)/utils/config";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuthContext } from "@/app/(utilities)/utils/AuthUser";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const page = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth, setData } = useAuthContext();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      toast.error("Please enter email and password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      toast.error("Please enter a valid email address.");
      return; // Exit the function if the email is invalid
    }

    let timer;
    setIsLoading(true);
    try {
      const data = {
        email: user.email,
        password: user.password,
      };
      const res = await axios.post(`${API}/signin`, data);
      if (res.data.success) {
        Cookies.set("token", res.data.token);
        setAuth(true);
        setData(res.data.data);
        toast.success(res.data.message);
        router.push("/tasks/mytasks");
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 6000);
      } else {
        toast.error(res.data.message || "Login failed");
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
      <div className="text-[22px] font-semibold">Log In</div>

      <div className="flex mt-3 flex-col gap-3">
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
          <Button disabled={isLoading} onClick={handleLogin} className="group w-full">
            {isLoading ? "Signing in..." : "Sign In"}
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
        <span className="pr-1">Dont have an account?</span>
        <Link href="/signup" className="underline text-[#e6b162]">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default page;
