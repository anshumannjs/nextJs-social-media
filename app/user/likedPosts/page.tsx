import GridPostList from "@/components/GridPostList";
import { Loader } from "lucide-react";

const LikedPosts = () => {
  const { data: currentUser } = {data: {liked: []}};

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.liked} showStats={false} />
    </>
  );
};

export default LikedPosts;
