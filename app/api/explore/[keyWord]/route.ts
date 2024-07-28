import { connectdb } from "@/database";
import post from "@/database/schema/post";
import { users } from "@/database/schema/user";
import restrictedApi from "@/middleware/restrictedApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {keyWord: string}}){
    const {hasAccess}=await restrictedApi()
    await connectdb()
    if (hasAccess){
        const {keyWord}: {keyWord: string}=params
        if (keyWord[0]==="#"){
            const slicedKeyWord=keyWord.slice(1)
            const postResult=await post.find({"tags": slicedKeyWord}).sort({"likes.length": 1}).limit(10)
            const regex={"$regex": slicedKeyWord, "$options": "i"}
            const userResult=await users.find({"bio": regex}).sort({"userDetails.followers.length": 1}).limit(10)
            if (postResult || userResult){
                return NextResponse.json({status: 200, postResult, userResult})
            }
        }
        else if (keyWord==="home"){
            const postResult=await post.find().sort({"likes.length": 1}).limit(10)
            if (postResult){
                return NextResponse.json({status: 200, postResult, userResult: null})
            }
        }
        else{
            const postResult=await post.find({"tags": keyWord}).sort({"likes.length": 1})
            const regex={"$regex": keyWord, "$options": "i"}
            const userResult=await users.find({$or: [{"firstName": regex}, {"lastName": regex}, {"email": regex}, {"userName": regex}]}).sort({"userDetails.followers.length": 1}).limit(10)
            if (postResult || userResult){
                return NextResponse.json({status: 200, postResult, userResult})
            }
        }
        return NextResponse.json({status: 200, message: "couldn't find anything"})
    }
    else{
        return NextResponse.json({status: 400, message: "you are not authorized"})
    }
}