"use client"
import { Loader } from "lucide-react";
import HomePage from "./user/home/page"
import { useSession } from "next-auth/react"
import LoginSignup from "./auth/page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router=useRouter();
  const session = useSession();
  const post = {
    creator: {
      imageUrl: "",
      name: "anshuman"
    },
    location: "delhi",
    tags: ["hello", "travel"],
    imageUrl: ""
  }
  useEffect(()=>{
    if (session.status==="authenticated"){
      router.push("/user/home")
    }
    else if (session.status==="unauthenticated") {
      router.push("/auth")
    }
  },[session])
  return (
    <div>
      {session.status==="loading"?
      <Loader/>:""}
    </div>
  )
}
