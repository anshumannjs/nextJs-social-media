"use client"
import { useEffect } from "react";

import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Topbar = () => {
  const {data}=useSession()
  const user = data?.user

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link href="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => {signOut()}}
            >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link href={`/user/profile/${user?._id}`} className="flex-center gap-3">
            <img
              src={user?.image || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
