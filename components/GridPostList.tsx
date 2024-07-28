"use client"
import PostStats from "@/components/PostStats";
import { IPostSchema } from "@/database/schema/post";
import { useEffect, useState } from "react";
import Link from "next/link";

type GridPostListProps = {
  posts: string[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const user = {}
  const [postList, setPostList]=useState<IPostSchema[]>()

  useEffect(()=>{
    fetchPosts()
  },[])

  async function fetchPosts(){
    posts.forEach(async(element)=>{
      const res=await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post?` + new URLSearchParams({ purpose: "postDetails", id: element }).toString())
      const data: {post?: IPostSchema, status: number, message?: string}=await res.json()
      if (data.post) postList?.push(data.post)
    })
  }

  return (
    <ul className="grid-container">
      {postList?.map((post) => (
        <li 
        key={post._id as string} 
        className="relative min-w-80 h-80">
          <Link href={`/user/postDetails/${post._id}`} className="grid-post_link">
            <img
              src={post.imageUrl[0] || "/assets/icons/profile-placeholder.svg"}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    // post.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{"post.creator.name"}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={"user.id"} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
