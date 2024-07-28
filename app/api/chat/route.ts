import { Router } from "express";

import chatModel, {IChatSchema} from "@/database/schema/chat"
import { messageModel, chatRoomContent, IChatRoomContentSchema, IMessageSchema } from "@/database/schema/chatRoomContent";
// import { socket } from "..";
import user, { IUserSchema } from "@/database/schema/user";
import mongoose, { ObjectId } from "mongoose";
import { IUserDetailsSchema, userDetails as userDetail } from "@/database/schema/userDetails";
import * as crypto from "crypto"
import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/database";

const router = Router();

export async function POST(req: Request){
    connectdb();
    async function symmetricOperation(...strings: ObjectId[]) {
        let concatenatedString: string = strings.join("");
        // let sortedString:string=concatenatedString.split("").sort().join("")
        // return sortedString
        return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(concatenatedString)))))
    }

    let { roomId, users, sender, message }: { roomId: ObjectId, users: ObjectId[], sender: ObjectId, message: string } = await req.json()
    if (roomId) {
        const room: IChatSchema | null = await chatModel.findById(roomId);
        if (room) {
            const newMessage: IMessageSchema = await messageModel.create({ sender, message })
            if (newMessage) {
                console.log("new message created")
            }
            else {
                // res.send("error occurred while creating a new message")
                return NextResponse.json({message: "error occurred while creating a new message"})
            }
            return new Promise(resolve=>chatModel.findByIdAndUpdate(roomId, { "$push": { "messages": newMessage } }).then((result) => {
                console.log(result);
                const emitMessage: object | null = filterUserMessage(roomId);
                if (emitMessage) {
                    // socket.io.emit("message", emitMessage)
                }
                else {
                    console.log("roomId not found")
                }
                // res.send("done")
                resolve(NextResponse.json({message: "done"}))
            }).catch((err) => console.log(err)))
        }
        else {
            // res.send("invalid roomId");
            return NextResponse.json({message: "invalid roomId"})
        }
    }
    else {
        if (users.length < 2) {
            // res.send("not enough users");
            return NextResponse.json({message: "not enough users"})
        }
        else {
            let roomName: string = await symmetricOperation(...users)
            console.log(typeof users)
            // users.forEach((element: ObjectId) => {
            //     console.log(typeof element)
            //     roomName = roomName + element
            // });
            console.log(roomName)

            const newMessage: IMessageSchema = await messageModel.create({ sender, message })
            if (newMessage) {
                console.log("new message created")
            }
            else {
                // res.send("error occurred while creating a new message")
                return NextResponse.json("error occurred while creating a new message")
            }

            const isThereRoomQuery: IChatSchema[] = await chatModel.find({ roomName})
            console.log(isThereRoomQuery[0])
            if (isThereRoomQuery[0]) {
                console.log("hello")
                const senderDetails:any = await user.findById(sender).populate<IUserSchema>("userDetails")
                if (senderDetails) {
                    console.log(senderDetails)
                    const userDetails: IUserDetailsSchema = senderDetails.userDetails
                    console.log(userDetails)
                    if (userDetails) {
                        return new Promise(resolve=>{
                            isThereRoomQuery[0].updateOne({ "$push": { "messages": newMessage } }).then((result: any) => {
                                console.log(result);
                                const emitMessage: object | null = filterUserMessage(isThereRoomQuery[0]._id);
                                if (emitMessage) {
                                    // socket.io.emit("message", emitMessage)
                                }
                                else {
                                    console.log("roomId not found")
                                }
                                // res.send("done")
                                resolve(NextResponse.json({message: "done"}))
                            }).catch((err: any) => console.log(err))
                            // await userDetail.findByIdAndUpdate(userDetails._id, { "$push": { "chatList": newMessage} })
                        })
                    }
                }
                else {
                    // res.send("error occurred while fetching sender details")
                    return NextResponse.json({message: "error occurred while fetching sender details"})
                }
            }
            else {
                const newRoom: IChatSchema = await chatModel.create({ roomName, messages: [newMessage], users })
                if (newRoom) {
                    console.log("new room created")
                }
                else {
                    // res.send("error occurred while creating a new room")
                    return NextResponse.json({message: "error occurred while creating a new room"})
                }
                const newUserDetails: IUserDetailsSchema = await userDetail.create({ chatList: [newRoom._id] });
                return new Promise(resolve=>users.forEach((userId: ObjectId) => {
                    user.findByIdAndUpdate(userId, {$push: {"userDetails.chatList": newRoom._id}}).then((result: any) => {
                        console.log(result)
                        const emitMessage: object | null = filterUserMessage(newRoom._id);
                        if (emitMessage) {
                            // socket.io.emit("message", emitMessage)
                        }
                        else {
                            console.log("roomId not found")
                        }
                        // res.send("done")
                        resolve(NextResponse.json({message: "done"}))
                    }).catch((err: any) => console.log(err))
                }))
            }

        }
    }
}

// router.post("/message", async (req: any, res: any) => {

//     async function symmetricOperation(...strings: ObjectId[]) {
//         let concatenatedString: string = strings.join("");
//         // let sortedString:string=concatenatedString.split("").sort().join("")
//         // return sortedString
//         return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(concatenatedString)))))
//     }

//     let { roomId, users, sender, message }: { roomId: ObjectId, users: ObjectId[], sender: ObjectId, message: string } = req.body;
//     if (roomId) {
//         const room: IChatSchema | null = await chatModel.findById(roomId);
//         if (room) {
//             const newMessage: IMessageSchema = await messageModel.create({ sender, message })
//             if (newMessage) {
//                 console.log("new message created")
//             }
//             else {
//                 res.send("error occurred while creating a new message")
//             }
//             await chatModel.findByIdAndUpdate(roomId, { "$push": { "messages": newMessage } }).then((result) => {
//                 console.log(result);
//                 const emitMessage: object | null = filterUserMessage(roomId);
//                 if (emitMessage) {
//                     // socket.io.emit("message", emitMessage)
//                 }
//                 else {
//                     console.log("roomId not found")
//                 }
//                 res.send("done")
//             }).catch((err) => console.log(err))
//         }
//         else {
//             res.send("invalid roomId");
//         }
//     }
//     else {
//         if (users.length < 2) {
//             res.send("not enough users");
//         }
//         else {
//             let roomName: string = await symmetricOperation(...users)
//             console.log(typeof users)
//             // users.forEach((element: ObjectId) => {
//             //     console.log(typeof element)
//             //     roomName = roomName + element
//             // });
//             console.log(roomName)

//             const newMessage: IMessageSchema = await messageModel.create({ sender, message })
//             if (newMessage) {
//                 console.log("new message created")
//             }
//             else {
//                 res.send("error occurred while creating a new message")
//             }

//             const isThereRoomQuery: IChatSchema[] = await chatModel.find({ roomName })
//             console.log(isThereRoomQuery[0])
//             if (isThereRoomQuery[0]) {
//                 const senderDetails: any = await user.findById(sender).populate("userDetails")
//                 if (senderDetails) {
//                     console.log(senderDetails)
//                     const userDetails: IUserDetailsSchema = senderDetails.userDetails
//                     console.log(userDetails)
//                     if (userDetails) {
//                         await isThereRoomQuery[0].updateOne({ "$push": { "messages": newMessage } }).then((result: any) => {
//                             console.log(result);
//                             const emitMessage: object | null = filterUserMessage(isThereRoomQuery[0]._id);
//                             if (emitMessage) {
//                                 // socket.io.emit("message", emitMessage)
//                             }
//                             else {
//                                 console.log("roomId not found")
//                             }
//                             res.send("done")
//                         }).catch((err: any) => console.log(err))
//                         // await userDetail.findByIdAndUpdate(userDetails._id, { "$push": { "chatList": newMessage} })
//                     }
//                 }
//                 else {
//                     res.send("error occurred while fetching sender details")
//                 }
//             }
//             else {
//                 const newRoom: IChatSchema = await chatModel.create({ roomName, messages: [newMessage], users })
//                 if (newRoom) {
//                     console.log("new room created")
//                 }
//                 else {
//                     res.send("error occurred while creating a new room")
//                 }
//                 const newUserDetails: IUserDetailsSchema = await userDetail.create({ chatList: [newRoom._id] });
//                 users.forEach(async (userId: ObjectId) => {
//                     await user.findByIdAndUpdate(userId, { "userDetails": newUserDetails }).then((result: any) => {
//                         console.log(result)
//                         const emitMessage: object | null = filterUserMessage(newRoom._id);
//                         if (emitMessage) {
//                             // socket.io.emit("message", emitMessage)
//                         }
//                         else {
//                             console.log("roomId not found")
//                         }
//                         res.send("done")
//                     }).catch((err: any) => console.log(err))
//                 })
//             }

//         }
//     }
// })

export async function GET(req: NextRequest){
    connectdb()
    let roomId=req.nextUrl.searchParams.get("roomId")
    const roomObj: IChatSchema | null = await chatModel.findById(roomId)
    if (roomObj) {
        let usersObj: any = []
        roomObj.users.forEach((userId: ObjectId) => {
            usersObj.push(user.findById(userId).select(["_id", "email", "firstName", "lastName", "userName", "image"]))
        })
        return new Promise(resolve=>{
            Promise.all(usersObj).then((value)=>{
                resolve(NextResponse.json({roomObj, usersObj: value}))
            }).catch((err)=>{
                resolve(NextResponse.json({error: err}))
            })
        })
    }
    else {
        return NextResponse.json({message: "room not found"})
    }
}

async function filterUserMessage(roomId: ObjectId) {
    const roomObj: IChatSchema | null = await chatModel.findById(roomId)
    if (roomObj) {
        let usersObj: IUserSchema[] = []
        roomObj.users.forEach(async (userId: ObjectId) => {
            const userObj: any = await user.findById(userId).populate(["_id", "email", "firstName", "lastName", "userName", "image"])
            if (userObj) {
                usersObj.push(userObj)
            }
        })
        return { ...roomObj, usersObj }
    }
    else {
        return null
    }
}