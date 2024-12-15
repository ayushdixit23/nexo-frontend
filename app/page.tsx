"use client"
import { redirect } from "next/navigation";
import { useAuthContext } from "./(utilities)/utils/auth";

export default function Home() {
  const { auth } = useAuthContext();

  if (auth) {
    return redirect("/tasks/mytasks");
  } else {
    return redirect("/login");
  }

  return <>
  
  </>;
}
