"use client"
import { Button } from "@/components/ui/button";
import LikedPosts from "../../likedPosts/page";
import { Loader } from "lucide-react";
import GridPostList from "@/components/GridPostList";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IUser } from "@/types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IUserSchema } from "@/database/schema/user";
import { IUserDetailsSchema } from "@/database/schema/userDetails";
import { ObjectId } from "mongoose";
import { Tabs, Tab } from "@nextui-org/react";

interface StabBlockProps {
    value: string | number;
    label: string;
    userId: string;
    clickable: boolean;
}

const StatBlock = ({ value, label, userId, clickable }: StabBlockProps) => {
    const path = useRouter()
    return (
        <div className={`flex-center gap-2 ${clickable ? "cursor-pointer" : ""}`} onClick={() => clickable ? path.push(`/user/${label}/${userId}`) : ""}>
            <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
            <p className="small-medium lg:base-medium">{label}</p>
        </div>
    );
}

const Profile = ({ params }: { params: { profileId: string } }) => {
    const pathname = usePathname()
    const { data } = useSession()
    const id = params.profileId
    const [user, setUser] = useState<IUserSchema | null>(null)
    const [userdetails, setUserDetails] = useState<IUserDetailsSchema | null>(null)
    const [isFollowing, setIsFollowing] = useState<boolean | undefined>()

    useEffect(() => {
        userdetails?.followers.includes(currentUser?._id as string) ? setIsFollowing(true) : setIsFollowing(false)
    }, [userdetails?.followers])

    function updateUser() {
        // fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/follow`).then((e) => e.json()).then((res) => {
        //     console.log(res)
        //     if (res.status === 200) {
        //         res?.following.includes(user?._id) ? setIsFollowing(true) : setIsFollowing(false)
        //     }
        //     else {
        //         setIsFollowing(false)
        //     }
        // })
        fetch("/api/user", {
            method: "POST",
            body: JSON.stringify({ id })
        }).then((e) => e.json()).then((e) => {
            if (e.status == 200) {
                setUser(e.user)
                setUserDetails(e.userDetails)
            }
            else {
                setUser(null)
                setUserDetails(null)
            }
        })
    }
    useEffect(() => {
        // fetch("/api/user", {
        //     method: "POST",
        //     body: JSON.stringify({ id })
        // }).then((e) => e.json()).then((e) => {
        //     if (e.status == 200) {
        //         setUser(e.user)
        //         setUserDetails(e.userDetails)
        //     }
        //     else {
        //         setUser(null)
        //         setUserDetails(null)
        //     }
        // })
        updateUser()
    }, [id])
    console.log(userdetails)

    const currentUser = data?.user

    async function handleClick() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/follow`, {
            method: "POST",
            body: JSON.stringify({ id: user?._id, action: isFollowing ? "unfollow" : "follow" })
        })
        console.log(res)
        const result = await res.json()
        console.log(result)
        setIsFollowing(undefined)
        updateUser()
    }

    if (!user)
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        );

    return (
        <div className="profile-container">
            <div className="profile-inner_container">
                <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
                    <img
                        src={
                            user?.image ||
                            "/assets/icons/profile-placeholder.svg"
                        }
                        alt="profile"
                        className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
                    />
                    <div className="flex flex-col flex-1 justify-between md:mt-2">
                        <div className="flex flex-col w-full">
                            <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                                {`${user.firstName} ` + `${user.lastName}`}
                            </h1>
                            <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                                @{user.userName}
                            </p>
                        </div>

                        <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                            <StatBlock value={userdetails ? userdetails.postList.length : 0} label="Posts" userId={id} clickable={false} />
                            <StatBlock value={userdetails ? userdetails.followers.length : 0} label="Followers" userId={id} clickable={true} />
                            <StatBlock value={userdetails ? userdetails.following.length : 0} label="Following" userId={id} clickable={true} />
                        </div>

                        <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                            {"user.bio"}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <div className={`${user._id !== currentUser?._id && "hidden"}`}>
                            <Link
                                href={`/user/updateProfile/${user._id}`}
                                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user._id !== currentUser?._id && "hidden"
                                    }`}>
                                <img
                                    src={"/assets/icons/edit.svg"}
                                    alt="edit"
                                    width={20}
                                    height={20}
                                />
                                <p className="flex whitespace-nowrap small-medium">
                                    Edit Profile
                                </p>
                            </Link>
                        </div>
                        <div className={`${user._id === currentUser?._id && "hidden"}`}>
                            {isFollowing === undefined ?
                                <Loader /> :
                                <Button onClick={handleClick} type="button" className="shad-button_primary px-8">
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {currentUser?._id === user._id && (
                <Tabs variant="underlined" className="flex max-w-5xl w-full justify-center">
                    <Tab title={
                        <div
                            // href={`/profile/${id}`}
                            className={`profile-tab rounded-l-lg 
                            }`}>
                            <img
                                src={"/assets/icons/posts.svg"}
                                alt="posts"
                                width={20}
                                height={20}
                            />
                            Posts
                        </div>
                    }>
                        <GridPostList posts={userdetails?.postList!} showUser={false} />
                    </Tab>

                    <Tab title={
                        <div
                            // href={`/profile/${id}/liked-posts`}
                            className={`profile-tab rounded-r-lg 
                            }`}>
                            <img
                                src={"/assets/icons/like.svg"}
                                alt="like"
                                width={20}
                                height={20}
                            />
                            Liked Posts
                        </div>
                    }>

                    </Tab>
                </Tabs>
            )}

            {/* <Routes>
                <Route
                    index
                    element={<GridPostList posts={currentUser.posts} showUser={false} />}
                />
                {currentUser.$id === user.id && (
                    <Route path="/liked-posts" element={<LikedPosts />} />
                )}
            </Routes>
            <Outlet /> */}
        </div>
    );
};

export default Profile;
