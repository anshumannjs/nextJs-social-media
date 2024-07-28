import { NextRequest, NextResponse } from "next/server";
import {users} from "@/database/schema/user.ts"
import helper from "@/utils/helper";
import { connectdb } from "@/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import restricted from "@/middleware/restrictedApi";

export async function signInWithCredentials({email, password}: {email: string, password: string}) {
    connectdb()
    const permit=await restricted();
    if (!permit.hasAccess && permit.code=="login"){
        const user=await users.findOne({email})
        if (user) {
            if (helper.comparePassword(password, user?.password)) {
                return {...user}
            }
            else {
                throw new Error("Wrong Password")
            }
        }
        else {
            throw new Error("No User Found")
        }
    }
}