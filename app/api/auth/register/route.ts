import { NextRequest, NextResponse } from "next/server";
import {users} from "@/database/schema/user.ts"
import helper from "@/utils/helper";
import { connectdb } from "@/database";
import restricted from "@/middleware/restrictedApi";
import { tokenGenerator } from "@/lib/tokenGenerator";

export async function POST(req: NextRequest) {
    const permit=await restricted();
    if (!permit.hasAccess && permit.code=="login"){
        const { password, email, firstName, lastName, userName }: { password: string, email: string, firstName: string, lastName: string, userName: string } = await req.json();
        if (password && email && firstName && lastName && userName) {
            // connectdb()
            // const userDb = await users.findOne({ email });
            // if (userDb) {
            //     return NextResponse.json({ status: 400, message: "user is already registered" })
            // }
            // else {
            //     const hashedPassword = helper.hashPassword(password);
            //     const newUser = await users.create({ password: hashedPassword, email, firstName, lastName, userName, verified: false });
            //     console.log(newUser)
            //     if (newUser){
            //         const token=await tokenGenerator(newUser._id, "userVerification")
            //         if (token){
            //             return NextResponse.json({status: 200, message: "verification link sent to email"})
            //         }
            //         else{
            //             return NextResponse.json({ status: 400, message: "couldnt send verification link" })
            //         }
            //     }
            // }
            registerUser({ password, email, firstName, lastName, userName, image: "" })
        }
        else {
            return NextResponse.json({ status: 400, message: "all the required fields are not given" })
        }
    }
}

export async function registerUser({ password, email, firstName, lastName, userName, image }: { password: string, email: string, firstName: string, lastName: string, userName: string, image: string }){
    connectdb()
    const userDb = await users.findOne({ email });
    if (userDb) {
        if (image===""){
            return NextResponse.json({ status: 400, message: "user is already registered" })
        }
        else{
            return NextResponse.json({status: 200, message: "successfully logged in"})
        }
    }
    else {
        const hashedPassword = helper.hashPassword(password);
        const newUser = await users.create({ password: (image.length>0)? "": hashedPassword, email, firstName, lastName, userName, verified: (image.length>0)? true: false, image });
        console.log(newUser)
        if (image===""){
            if (newUser){
                const token=await tokenGenerator(newUser._id, "userVerification")
                if (token){
                    return NextResponse.json({status: 200, message: "verification link sent to email"})
                }
                else{
                    return NextResponse.json({ status: 400, message: "couldnt send verification link" })
                }
            }
        }
        else{
            return NextResponse.json({status: 200, message: "user succesfully logged in"})
        }
    }
}