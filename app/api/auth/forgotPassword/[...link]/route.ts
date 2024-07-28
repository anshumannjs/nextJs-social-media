import { NextRequest, NextResponse } from "next/server"
import { users } from "@/database/schema/user"
import { tokenModel } from "@/database/schema/token"
import helper from "@/utils/helper"

export async function POST(req: NextRequest, {params}: {params: {link: string[]}}){
    const userId=params.link[0]
    const token=params.link[1]
    console.log(userId, token)

    const {password}=await req.json()

    const user=await users.findById(userId)
    if (!user){
        return NextResponse.json({status: 400, message: "invalid link or expired"})
    }
    const tokenFromDb=await tokenModel.findOne({userId, token})
    if (!tokenFromDb){
        console.log("hello")
        return NextResponse.json({status: 400, message: "invalid link or expired"})
    }
    const hashedPassword=helper.hashPassword(password)
    const passwordReset=await users.findByIdAndUpdate(userId, {password: hashedPassword})
    if (passwordReset){
        return NextResponse.json({status: 200, message: "password reset successfully"})
    }
    else{
        return NextResponse.json({status: 400, message: "some error occured while resetting password"})
    }
}