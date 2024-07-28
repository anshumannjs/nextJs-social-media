import { connectdb } from "@/database";
import restrictedApi from "@/middleware/restrictedApi";
import { NextResponse, NextRequest } from "next/server";
import { uploadToSupabaseFromServer } from "@/utils/fileUploader";
import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import { IUserSchema, users } from "@/database/schema/user";
import post, { IPostSchema } from "@/database/schema/post";
import { IUserDetailsSchema, userDetails } from "@/database/schema/userDetails";
import { useRouter } from "next/navigation";
import { createNotification } from "../notification/route";

export async function POST(req: NextRequest) {
    const { hasAccess, userId } = await restrictedApi()

    if (hasAccess) {
        // const supabase=createServerClient(
        //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
        //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        //     {
        //         cookies: {
        //             getAll(){
        //                 return Object.keys(req.cookies).map((name)=>({name, value: req.cookies[name as keyof object]}))
        //             }
        //         }
        //     }
        // )
        const formData = await req.formData()
        const file = formData.getAll("file") as File[]
        console.log(file)
        const b64 = Buffer.from(await file[0]?.arrayBuffer()).toString("base64")

        // const {data, error}=await supabase.storage.from("images").createSignedUploadUrl(file.name, {
        //     upsert: true
        // })
        // return NextResponse.json({status: 200, link: data?.signedUrl})
        // console.log("data", data)
        // console.log("err", error)
        // if (data){
        //     const result=supabase.storage.from("images").getPublicUrl(data?.path!)
        //     console.log(result)
        // }
        var newPromise = new Promise((resolve, reject) => {
            var imageUrlArr: string[] = []
            file.forEach(async (value, index) => {
                const { data, error } = await uploadToSupabaseFromServer(value)
                if (error) reject(error);
                imageUrlArr.push(data?.publicUrl!)
                if (file.length - 1 === index) resolve(imageUrlArr);
            })
        })

        const data = await newPromise

        if (data) {
            connectdb()
            const user: IUserSchema | null = await users.findById(userId)
            const postObj = await post.create({ caption: formData.get("caption"), tags: formData.get("tags"), location: formData.get("location"), imageUrl: data, userId, name: user?.firstName + " " + user?.lastName })
            if (postObj) {
                const userdetails: IUserDetailsSchema | null = await userDetails.findOne({ "userId": userId })
                if (userdetails) {
                    userdetails.postList.push(postObj._id)
                    const updatedUserDetails = await userdetails.save()
                    if (updatedUserDetails) {
                        const notification = await createNotification({ about: "uploaded a new post", recipentArr: updatedUserDetails.followers, senderName: user?.firstName + " " + user?.lastName, link: postObj._id })
                        if (notification.status===200) {
                            return NextResponse.json({ status: 200, message: "successfully updated" })
                        }
                        else {
                            return NextResponse.json({ status: 200, message: "successfully updated but couldn't create notification" })
                        }
                    }
                    else {
                        return NextResponse.json({ status: 400, message: "couldn't upload image" })
                    }
                }
                else {
                    const newUserDetails = await userDetails.create({ userId, postList: [postObj._id] });
                    if (newUserDetails) {
                        const user = await users.findByIdAndUpdate(userId, { "userDetails": newUserDetails._id })
                        if (user) {
                            const notification = await createNotification({ about: "uploaded a new post", recipentArr: newUserDetails.followers, senderName: user?.firstName + " " + user?.lastName, link: postObj._id })
                            if (notification.status===200) {
                                return NextResponse.json({ status: 200, message: "successfully updated" })
                            }
                            else {
                                return NextResponse.json({ status: 200, message: "successfully updated but couldn't create notification" })
                            }
                        }
                        else {
                            return NextResponse.json({ status: 400, message: "couldn't upload image" })
                        }
                    }
                    else {
                        return NextResponse.json({ status: 400, message: "couldn't upload image" })
                    }
                }
            }
            else {
                return NextResponse.json({ status: 400, message: "couldn't upload image" })
            }
        }
        else {
            return NextResponse.json({ status: 400, message: "couldn't upload image" })
        }
    }
    else {
        return NextResponse.json({ status: 400, message: "you are not authorized" })
    }
}

export async function GET(req: NextRequest) {
    const { hasAccess, userId } = await restrictedApi()
    console.log(userId)
    if (hasAccess) {
        const purpose = req.nextUrl.searchParams.get("purpose")
        const id = req.nextUrl.searchParams.get("id")
        if (purpose === "home") {
            if (id == userId) {
                await connectdb()
                const userdetails: IUserDetailsSchema | null = await userDetails.findOne({ userId })
                const following = userdetails?.following
                if (following?.length! > 0) {
                    var newPromise = new Promise((resolve, reject) => {
                        var postsArr: any[] = []
                        following?.forEach(async (value, index) => {
                            const { data, error } = await fetchNewPostsById(value)
                            if (error) reject(error);
                            postsArr.push(...data)
                            if (following.length - 1 === index) resolve(postsArr);
                        })
                    })
                    const data = await newPromise
                    console.log(data)
                    if (data) {
                        return NextResponse.json({ status: 200, data })
                    }
                    else {
                        return NextResponse.json({ status: 400, message: "you don't have any data" })

                    }
                }
                else {
                    return NextResponse.json({ status: 400, message: "don't have any followers" })
                }
            }
            else {
                return NextResponse.json({ status: 400, message: "you are not authorized" })
            }
        }
        else if (purpose === "postDetails") {
            const postObj: any = await post.findById(id).lean()
            if (postObj) {
                const user: IUserSchema | null = await users.findById(postObj.userId)
                postObj.name = user?.firstName + " " + user?.lastName
                return NextResponse.json({ status: 200, post: postObj })
            }
            else {
                return NextResponse.json({ status: 400, message: "not found, user might have deleted it" })
            }
        }
    }
    else {
        return NextResponse.json({ status: 400, message: "you are not authorized" })
    }
}

export async function fetchPostFromDb(id: string) {
    const { hasAccess } = await restrictedApi()
    if (hasAccess) {
        const posts: IPostSchema | null = await post.findById(id)
        if (posts) {
            return { data: posts, error: null }
        }
        else {
            return { error: "couldn't find the post", data: null }
        }
    }
    else {
        return { error: "you don't have access", data: null }
    }
}

async function fetchAllPostsById(id: string) {

}

async function fetchNewPostsById(id: string) {
    const { userId } = await restrictedApi()
    const posts = await post.find({ $and: [{ userId: id }, { views: { "$ne": userId } }] }).lean()
    if (posts.length>0){
        console.log(posts)
        const user: IUserSchema | null = await users.findById(posts[0].userId)
        posts.forEach((value) => {
            value.userImage = user?.image
            value.name = user?.firstName + " " + user?.lastName
        })
        return { data: posts, error: null };
    }
    else{
        return {data: [], error: null}
    }
}