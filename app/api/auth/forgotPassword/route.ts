import { NextRequest, NextResponse } from "next/server";
import { tokenGenerator } from "@/lib/tokenGenerator";
import { users } from "@/database/schema/user";
import restricted from "@/middleware/restrictedApi";

export async function POST(req: NextRequest){
    const permit=await restricted();
    console.log(permit)
    if (!permit.hasAccess && permit.code=="login"){
        const {email}=await req.json();
        console.log(email)
        const user=await users.findOne({email})
        if (!user){
            return NextResponse.json({status:400, message: "user not found with given email"})
        }
        const token=await tokenGenerator(user._id, "ForgotPassword")
        if (token){
            return NextResponse.json({status: 200, messsage: "link sent to the email", email: email})
        }
        else {
            return NextResponse.json({status: 400, message: "something went wrong please try again"})
        }
    }
    else{
        return NextResponse.json({status: 400, message: "you dont have access to this api route"})
    }
}