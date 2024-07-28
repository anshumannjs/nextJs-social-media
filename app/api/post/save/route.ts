import post, { IPostSchema } from "@/database/schema/post";
import { IUserDetailsSchema, userDetails } from "@/database/schema/userDetails";
import restrictedApi from "@/middleware/restrictedApi";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "../../notification/route";
import { users } from "@/database/schema/user";

export async function POST(req: NextRequest) {
    const { hasAccess, userId } = await restrictedApi()

    if (hasAccess) {
        const { postId } = await req.json()

        const postObj: IPostSchema | null = await post.findByIdAndUpdate(postId, { $addToSet: { bookMarks: userId } })
        const userdetails: IUserDetailsSchema|null=await userDetails.findOneAndUpdate({userId}, {$addToSet: {saves: postObj?._id}})

        if (postObj && userdetails) {
            const user=await users.findById(userId)
            const notification=await createNotification({about: "saved your post", link: postObj._id as string, recipentArr: [postObj.userId as unknown as string], senderName: user.firstName+" "+user.lastName})
            if (notification.status===200) {
                return NextResponse.json({ status: 200, post: postObj })
            }
            else {
                return NextResponse.json({ status: 200, message: "successfully updated but couldn't create notification" })
            }
        }
        else {
            return NextResponse.json({ status: 400, message: "couldn't update" })
        }
    }
    else {
        return NextResponse.json({ status: 400, message: "you are not authorized" })
    }
}