"use client"
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import UserCard from "@/components/UserCard";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { IUserSchema } from "@/database/schema/user";

const AllUsers = ({ params }: { params: { userList: string[]} }) => {
  const { toast } = useToast();
  const label=params.userList[0]
  const userId=params.userList[1]

  const {mutate, isPending: isLoading, isError: isErrorCreators, data: creators}=useMutation({
    mutationFn: ()=>fetchUsers(),
    onSuccess: (data)=>console.log(data)
  })

  async function fetchUsers(){
    const res=await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
      body: JSON.stringify({id: userId}),
      method: "POST"
    })
    const user=await res.json()
      const result=await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
        body: JSON.stringify({id: user.userDetails[`${label.toLowerCase()}`]}),
        method: "POST"
      })
    return await result.json()
  }

  useEffect(()=>{
    mutate()
  },[mutate])

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">{label}</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.userArr.map((creator: IUserSchema) => (
              <li key={`${creator._id}`} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
