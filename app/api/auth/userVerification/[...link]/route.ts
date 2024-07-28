import { NextRequest, NextResponse } from "next/server"
import { users } from "@/database/schema/user"
import { tokenModel } from "@/database/schema/token"

export async function GET(req: NextRequest, {params}: {params: {link: string[]}}){
    const userId=params.link[0]
    const token=params.link[1]

    const user=await users.findById(userId)
    if (!user){
        return NextResponse.json({status: 400, message: "invalid link or expired"})
    }
    const tokenFromDb=await tokenModel.findOne({userId, token})
    if (!tokenFromDb){
        return NextResponse.json({status: 400, message: "invalid link or expired"})
    }
    const verifiedUser=await users.findByIdAndUpdate(userId, {verified: true})
    if (verifiedUser){
        return NextResponse.json({status: 200, message: "successfully verified", verifiedUser})
    }
    else {
        return NextResponse.json({status: 400, message: "couldnt verify user"})
    }
}