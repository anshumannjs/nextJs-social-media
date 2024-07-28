import { authOptions } from "@/lib/authOptions";
import { useSession } from "next-auth/react";

export const restricted=async ()=>{
    const session =useSession();
    
}