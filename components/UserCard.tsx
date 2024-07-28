"use client"
import { IUserSchema } from "@/database/schema/user";
import { Button } from "./ui/button";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

type UserCardProps = {
  user: IUserSchema;
};

const UserCard = ({ user }: UserCardProps) => {
  const {data}=useSession()
  const [isFollowing, setIsFollowing]=useState<boolean|undefined>()

  useEffect(()=>{
    updateFollowers()
  },[])

  function updateFollowers(){
    console.log("hello")
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/follow`).then((e)=>e.json()).then((res)=>{
      console.log(res)
      if (res.status===200){
        res?.following.includes(user._id)?setIsFollowing(true):setIsFollowing(false)
      }
      else{
        setIsFollowing(false)
      }
    })
  }
  
  function truncate(str: string){
    if (str.length>8){
      return `${str.slice(0,4)}...`
    }
    else{
      return str
    }
  }
  async function handleClick(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>){
    console.log(`${process.env.NEXT_PUBLIC_URL}/api/user/follow`)
    e.preventDefault()
    const res=await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/follow`,{
      method: "POST",
      body: JSON.stringify({id: user._id, action: isFollowing?"unfollow":"follow"})
    })
    console.log(res)
    const result=await res.json()
    console.log(result)
    setIsFollowing(undefined)
    updateFollowers()
  }

  return (
    <Link href={`/user/profile/${user._id}`} className="user-card">
      <Image
        src={user.image || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14 border border-black"
        height={14}
        width={14}
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-center line-clamp-1">
          {truncate(user.firstName)}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{truncate(user.userName)}
        </p>
      </div>

      {data?.user._id===user._id?""
      :
      <>
      {isFollowing===undefined?
      <Loader/>:
      <Button onClick={(e)=>handleClick(e)} type="button" size="sm" className="shad-button_primary px-5">
        {isFollowing?"Unfollow":"Follow"}
      </Button>
      }
      </>
      }
    </Link>
  );
};

export default UserCard;
