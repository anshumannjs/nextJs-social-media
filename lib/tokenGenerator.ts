import { ObjectId } from "mongoose"
import { tokenModel, IToken } from "@/database/schema/token"
import crypto from "crypto"
import { sendEmail } from "./emailSender"
import { users,IUserSchema } from "@/database/schema/user"

export const tokenGenerator=async(userId: ObjectId, objective: string)=>{
    const user:IUserSchema|null=await users.findById(userId)
    if (user){
        let token: IToken|null = await tokenModel.findOne({userId})
        if (!token){
            token= await tokenModel.create({userId, token: crypto.randomBytes(32).toString("hex")})
        }
        if (token){
            const link=`${process.env.NEXT_PUBLIC_URL}/api/auth/${objective}/${userId}/${token.token}`
            const htmlLink=`${process.env.NEXT_PUBLIC_URL}/auth/${objective}/${userId}/${token.token}`
            const mailOptions={
                from: process.env.ZOHO_USER||"",
                to: user.email,
                subject: "user verification link",
                text: `to verify your account click on this link    --->    ${objective=="ForgotPassword"? htmlLink: link}`
            }
            const mail=await sendEmail(mailOptions)
            console.log("mail", mail)
            if (mail){
                return true
            }
            else{
                return false
            }
        }
        else{
            return false
        }
    }
    else{
        return false
    }
}