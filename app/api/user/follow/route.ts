import { connectdb } from "@/database";
import { IUserSchema, users } from "@/database/schema/user";
import { IUserDetailsSchema, userDetails, userDetailsModel } from "@/database/schema/userDetails";
import restrictedApi from "@/middleware/restrictedApi";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "../../notification/route";

export async function POST(req: NextRequest) {
    const { hasAccess, userId } = await restrictedApi()
    if (hasAccess) {
        const { id, action } = await req.json()
        if (id === userId) {
            return NextResponse.json({ status: 400, message: "can't perform action on same id" })
        }
        await connectdb()
        if (action === "follow") {
            const currentUserDetails: IUserDetailsSchema | null = await userDetails.findOne({ userId })
            const userdetails: IUserDetailsSchema | null = await userDetails.findOne({ userId: id })
            console.log(currentUserDetails, userdetails)
            if (currentUserDetails && userdetails) {
                const updatedCurrUser = await userDetails.findByIdAndUpdate(currentUserDetails._id, { $addToSet: { "following": id } })
                const updatedUser = await userDetails.findByIdAndUpdate(userdetails._id, { $addToSet: { "followers": userId } })
                // currentUserDetails.following.push(id)
                // userdetails.followers.push(userId)
                // await currentUserDetails.save()
                // await userdetails.save()
                if (updatedCurrUser && updatedUser) {
                    const user = await users.findById(userId)
                    const notification = await createNotification({ about: "followed you", senderName: user.firstName + " " + user.lastName, link: userId, recipentArr: [id] })
                    if (notification.status === 200) {
                        return NextResponse.json({ status: 200, message: "successfully updated" })
                    }
                    else {
                        return NextResponse.json({ status: 200, message: "successfully updated but couldn't create notification" })
                    }
                }
            }
            else if (currentUserDetails === null && userdetails === null) {
                const newCurrentUserDetails: IUserDetailsSchema | null = await userDetails.create({ userId, following: [id] })
                const newUserDetails: IUserDetailsSchema | null = await userDetails.create({ userId: id, followers: [userId] })
                if (newCurrentUserDetails && newUserDetails) {
                    const currentUser: IUserSchema | null = await users.findByIdAndUpdate(userId, { "userDetails": newCurrentUserDetails._id })
                    const user: IUserSchema | null = await users.findByIdAndUpdate(id, { "userDetails": newUserDetails._id })
                    if (user && currentUser) {
                        const notification = await createNotification({ about: "followed you", senderName: user.firstName + " " + user.lastName, link: userId, recipentArr: [id] })
                        if (notification.status === 200) {
                            return NextResponse.json({ status: 200, message: "successfully updated" })
                        }
                        else {
                            return NextResponse.json({ status: 200, message: "successfully updated but couldn't create notification" })
                        }
                    }
                    else {
                        return NextResponse.json({ status: 400, message: "couldn't follow" })
                    }
                }
                else {
                    return NextResponse.json({ status: 400, message: "couldn't create a new userDetails" })
                }
            }
            else {
                if (currentUserDetails) {
                    const newUserDetails: IUserDetailsSchema | null = await userDetails.create({ userId: id, followers: [userId] })
                    if (newUserDetails) {
                        const user: IUserSchema | null = await users.findByIdAndUpdate(id, { "userDetails": newUserDetails._id })
                        const updatedCurrUser = await userDetails.findByIdAndUpdate(currentUserDetails._id, { $addToSet: { "following": id } })
                        // currentUserDetails.following.push(id)
                        // await currentUserDetails.save()
                        if (user && updatedCurrUser) {
                            const notification = await createNotification({ about: "followed you", senderName: user.firstName + " " + user.lastName, link: userId, recipentArr: [id] })
                            if (notification.status === 200) {
                                return NextResponse.json({ status: 200, message: "successfully updated" })
                            }
                            else {
                                return NextResponse.json({ status: 200, message: "successfully updated but couldn't create notification" })
                            }
                        }
                        else {
                            return NextResponse.json({ status: 400, message: "couldn't follow" })
                        }
                    }
                }
                else {
                    const newCurrentUserDetails: IUserDetailsSchema | null = await userDetails.create({ userId, following: [id] })
                    if (newCurrentUserDetails) {
                        const currentUser: IUserSchema | null = await users.findByIdAndUpdate(userId, { "userDetails": newCurrentUserDetails._id })
                        const updatedUser = await userDetails.findByIdAndUpdate(userdetails?._id, { $addToSet: { "followers": userId } })
                        // userdetails?.followers.push(userId)
                        // await userdetails?.save()
                        if (currentUser && updatedUser) {
                            const notification = await createNotification({ about: "followed you", senderName: currentUser.firstName + " " + currentUser.lastName, link: userId, recipentArr: [id] })
                            if (notification.status === 200) {
                                return NextResponse.json({ status: 200, message: "successfully updated" })
                            }
                            else {
                                return NextResponse.json({ status: 200, message: "successfully updated but couldn't create notification" })
                            }
                        }
                        else {
                            return NextResponse.json({ status: 400, message: "couldn't follow" })
                        }
                    }
                }
            }
        }
        else if (action === "unfollow") {
            const currentUserDetails: IUserDetailsSchema | null = await userDetails.findOneAndUpdate({ userId }, { $pull: { "following": id } })
            const userdetails: IUserDetailsSchema | null = await userDetails.findOneAndUpdate({ "userId": id }, { $pull: { "followers": userId } })
            if (userdetails && currentUserDetails) {
                const user = await users.findById(userId)
                const notification = await createNotification({ about: "unfollowed you", link: userId, recipentArr: [id], senderName: user.firstName + " " + user.lastName })
                return NextResponse.json({ status: 200, message: "successfully updated" })
            }
            else {
                return NextResponse.json({ status: 400, message: "couldn't unfollow" })
            }
        }
        else {
            return NextResponse.json({ status: 400, message: "couldn't follow action" })
        }
    }
    else {
        return NextResponse.json({ status: 400, message: "you are not authorized" })
    }
}

export async function GET() {
    const { hasAccess, userId } = await restrictedApi()
    if (hasAccess) {
        const userdetails: IUserDetailsSchema | null = await userDetails.findOne({ userId })
        if (userdetails) {
            return NextResponse.json({ status: 200, followers: userdetails.followers, following: userdetails.following })
        }
        else {
            return NextResponse.json({ status: 400, message: "don't have any userDetails" })
        }
    }
    else {
        return NextResponse.json({ status: 400, message: "you are not authorized" })
    }
}