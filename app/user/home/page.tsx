"use client"
// import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import PostCard from "@/components/PostCard";
import UserCard from "@/components/UserCard";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const HomePage = ({searchParams}: {searchParams: string}) => {
  // const { toast } = useToast();
  const {data: sessionData}=useSession();
  console.log(sessionData)
  console.log(window.location.host)
  
  const {mutate: fetchFeedPosts, data: posts, isPending: isPostLoading, isError:isErrorPosts}=useMutation({
    mutationFn: ()=>handlePost(),
    onSuccess: (data)=>console.log(data)
  })

  async function handlePost(){
    const result=await fetch(`http://${window.location.host}/api/post?`+ new URLSearchParams({purpose: "home", id: sessionData?.user._id!}).toString());
    return await result.json()
  }
  async function handleTopCreators(){
    const result=await fetch(`http://${window.location.host}/api/user`, {
      method: "POST",
      body: JSON.stringify({purpose: "home"})
    })
    return await result.json()
  }

  useEffect(()=>{
    if (sessionData){
      fetchFeedPosts()
      fetchTopCreators()
    }
  },[sessionData])

  const {
    data: creators,
    isPending: isUserLoading,
    isError: isErrorCreators,
    mutate: fetchTopCreators,
  } = useMutation({
    mutationFn: ()=>handleTopCreators(),
    onSuccess: (data)=>console.log(data)
  })

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.data?.map((post: any) => (
                <li key={post._id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.usersArr.map((creator: any) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
