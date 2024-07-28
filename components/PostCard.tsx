import { IPostSchema } from "@/database/schema/post";
import PostStats from "./PostStats";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { multiFormatDateString } from "@/lib/utils";

type PostCardProps = {
  post: any;
};

const PostCard = ({ post }: PostCardProps) => {
  const {data}=useSession()
  console.log(post)

  if (!post) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link href={`/user/profile/${post.userId}`}>
            <img
              src={
                post?.userImage ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold">
              {post.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {/* {multiFormatDateString(post.$createdAt)} */} monday
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/user/editPost/${post._id}`}
          className={`${data?.user._id != post?.userId as unknown  && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link href={`/user/postDetails/${post._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: number) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl[0] || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={"user.id"} />
    </div>
  );
};

export default PostCard;
