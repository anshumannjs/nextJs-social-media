import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions"

export const authServerSession=async ()=>{return await getServerSession(authOptions)}
