"use client"
import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
// import { Loader } from "@/components/shared";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LeftSidebar = ({notification, setNotification}: {notification: boolean, setNotification: Dispatch<SetStateAction<boolean>>}) => {
  // const { setUser, setIsAuthenticated, isLoading } = {setUser:{}, setIsAuthenticated:(value: boolean)=>console.log(value), isLoading:{}}
  console.log(notification)
  const router=usePathname()
  const query=useSearchParams()
  const {data, status}=useSession()
  const user=data?.user
  const [isLoading, setIsLoading]=useState(true)
  useEffect(()=>{
    if (status==="loading"){
      setIsLoading(true)
    }
    else{
      setIsLoading(false)
    }
  },[status])

  function handleNotificationClick(e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>){
    e.preventDefault()
    setNotification(true)
  }

  return (
    <nav className="leftsidebar overflow-y-auto">
      <div className="flex flex-col gap-11">
        <Link href="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        {isLoading || !user?.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link href={`/user/profile/${user._id}`} className="flex gap-3 items-center">
            <img
              src={user.image || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.firstName}</p>
              <p className="small-regular text-light-3">@{user.userName}</p>
            </div>
        </Link>
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = link.route===router

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  notification?(link.data?"bg-primary-500": ""):(isActive && "bg-primary-500")
                }`}>
                <Link
                  href={link.route}
                  onClick={(e)=>link.data?handleNotificationClick(e):null}
                  className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      notification?(link.data?"invert-white": ""):(isActive && "invert-white")
                    }`}
                  />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => signOut()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
