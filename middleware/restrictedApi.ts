"use server"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";

export default async ()=>{
    const session: any = await getServerSession(authOptions)
    console.log(session)

    if (session){
        // return NextResponse.redirect(req.url)
        if (session?.user.verified){
            return {hasAccess: true, code: "verified", userId: session.user._id}
        }
        else{
            return {hasAccess: false, code: "unverified", userId: session.user._id}
        }
    }
    else {
        // if (req.nextUrl.pathname.startsWith("/api/auth")){
        //     return NextResponse.redirect(req.url)
        // }
        // else{
        //     return NextResponse.json({status: 400, message: "you do not have access. please login"})
        // }
        return {hasAccess: false, code: "login"}
    }
}