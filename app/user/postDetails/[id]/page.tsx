"use client"
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import GridPostList from "@/components/GridPostList";
import PostStats from "@/components/PostStats";

import { multiFormatDateString } from "@/lib/utils";
import { IPostSchema } from "@/database/schema/post";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface propsData extends Partial<IPostSchema>{
  userImage: string
}

const PostDetails = ({ params, data }: { params: { id: string }, data?: propsData }) => {
  const { id } = params
  const { back } = useRouter()
  const {data: userData}=useSession()
  const user=userData?.user
  const [post, setPost]=useState<propsData>()

  useEffect(() => {
    if (!data) {
      fetchPost()
    }
    else{
      setPost(data)
    }
  }, [data])

  const { data: fetchedPost, isPending: isLoading, mutate: fetchPost } = useMutation({
    mutationFn: () => handlePost(),
    onSuccess: (data) => setPost(data.post)
  })
  const { data: userPosts, isLoading: isUserPostLoading } = { data: {}, isLoading: false }
  const { mutate: deletePost } = { mutate: (value: any) => console.log(value) }

  const relatedPosts: any = []

  async function handlePost() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post?` + new URLSearchParams({ purpose: "postDetails", id }).toString())
    return await res.json()
  }

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?._id });
    // navigate(-1);
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => back()}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.userImage}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                href={`/user/profile/${post?.userId}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.imageUrl?post?.imageUrl[0]:"" ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {/* {multiFormatDateString(post?.$createdAt)} */} monday
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location} delhi
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  href={`/user/updatePost/${post?._id}`}
                  className={`${user?._id !== post?.userId as unknown && "hidden"}`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={24}
                  height={24}
                />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user?._id !== post?.userId as unknown && "hidden" 
                    }`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.map((tag: string, index: number) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={"user.id"} />
            </div>
          </div>
        </div>
      )}

      {/* <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div> */}
    </div>
  );
};

export default PostDetails;
