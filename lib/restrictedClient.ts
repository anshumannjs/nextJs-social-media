import { useSession } from "next-auth/react";

export async function restrictedClient(id: string){
    const session=useSession()

    const result=await fetch("/api/user", {
        body: JSON.stringify({id}),
        method: "POST"
    })
    const user=await result.json()

    if (session.data?.user._id===user.user._id){
        return {isAllowed: true}
    }
    return {isAllowed: false}
}