import notification, { INotificationSchema } from "@/database/schema/notification";
import { IUserDetailsSchema, userDetails } from "@/database/schema/userDetails";
import restrictedApi from "@/middleware/restrictedApi";
import { NextResponse } from "next/server";

export async function createNotification({recipentArr, about, senderName, link}: {recipentArr: string[], about: string, senderName: string, link: string}){
    const {hasAccess, userId}=await restrictedApi()

    if (hasAccess){
        const notificationObj=await notification.create({recipentArr, sender: userId, about, link, unreadUsers: recipentArr, senderName})
        if (notificationObj){
            const res=await fetch(`${process.env.EXPRESS_SOCKET_URL}/notification`, {
                method: 'POST',
                body: JSON.stringify(notificationObj),
                headers: new Headers({"content-type": "application/json"})
            })
            var newPromise=new Promise((resolve, reject)=>{
                recipentArr.forEach(async(value, index)=>{
                    const userdetails=await userDetails.findOneAndUpdate({userId: value}, {$addToSet: {notification: notificationObj}})
                    if (recipentArr.length-1===index) resolve("done");
                })
            })
            const result=await newPromise
            if (result){
                return {status: 200, notificationObj}
            }
            else{
                return {status: 400, message: "couldn't notify all recipents"}
            }
        }
        else{
            return {status: 400, message: "couldn't create a notification"}
        }
    }
    else {
        return {status: 400, message: "not authorized"}
    }
}

export async function GET(){
    const {hasAccess, userId}=await restrictedApi()

    if (hasAccess){
        const userdetails: IUserDetailsSchema|null=await userDetails.findOne({userId})
        console.log(userdetails)
        const demoNotification: INotificationSchema[]|null=await notification.find({recipentArr: userId})
        
        if (demoNotification){
            return NextResponse.json({status: 200, notificationArr: demoNotification})
        }
        else{
        return {status: 400, notificationArr: []}
        }

        // var newPromise=new Promise((resolve, reject)=>{
        //     const notificationArr: any=[]
        //     if (userdetails?.notifications.length==0) resolve(notificationArr)
        //     userdetails?.notifications.forEach(async(value, index)=>{
        //         const notificationObj=await notification.findById(value)
        //         if (!notificationObj){
        //             const result=await userDetails.findOneAndUpdate({userId}, {$pull: {notifications: value}})
        //         }
        //         notificationArr.push(notificationObj)
        //         if (userdetails.notifications.length-1===index) resolve(notificationArr);
        //     })
        // })

        // const data=await newPromise
        // if (data){
        //     return NextResponse.json({status: 200, notificationArr: data})
        // }
    }
    else {
        return {status: 400, message: "not authorized"}
    }
}