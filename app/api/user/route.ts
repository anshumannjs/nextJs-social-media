import { NextRequest, NextResponse } from "next/server";
import { IUserSchema, users } from "@/database/schema/user";
import { connectdb } from "@/database";
import { IUserDetailsSchema, userDetails } from "@/database/schema/userDetails";

export async function POST(req: NextRequest){
    connectdb()
    const {id, purpose}=await req.json()
    console.log(id)

    if (purpose==="home"){
        console.log("hello")
        const userDetailsArr: IUserDetailsSchema[]|null=await userDetails.find({}).sort({"followers.length": 1}).limit(20)
        console.log(userDetailsArr)
        if (userDetailsArr.length>0){
            var newPromise=new Promise<IUserSchema[]>((resolve, reject)=>{
                const userArr: IUserSchema[]=[]
                userDetailsArr.forEach(async(element: IUserDetailsSchema, index: number) => {
                    const result=await users.findById(element.userId)
                    userArr.push(result)
                    if (index===userDetailsArr.length-1){
                        resolve(userArr)
                    }
                });
            })
            const result=await newPromise
            return NextResponse.json({status: 200, usersArr: result})
        }
        else {
            return NextResponse.json({status: 400, message: "No top creators available"})
        }
    }

    if(typeof id==="object"){
        var newPromise=new Promise<IUserSchema[]>((resolve, reject)=>{
            const userArr: IUserSchema[]=[]
            id.forEach(async(element: string, index: number) => {
                const result=await users.findById(element)
                userArr.push(result)
                if (index===id.length-1){
                    resolve(userArr)
                }
            });
        })
        const result=await newPromise
        if (result.length>0){
            return NextResponse.json({status: 200, userArr: result})
        }
    }
    else if (typeof id==="string"){
        const result=await users.findById(id)
        const userdetails=await userDetails.findOne({userId: id})
        console.log(result)
    
        if (result && userdetails){
            const {password, ...user}=result._doc
            return NextResponse.json({status: 200, user, userDetails: userdetails})
        }
    }
    return NextResponse.json({status: 400, message: "User not found, might have deleted their account"})
}