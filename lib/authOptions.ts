import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { signInWithCredentials } from "@/app/api/auth/login/route"
import { AuthOptions } from "next-auth"
import { registerUser } from "@/app/api/auth/register/route"
import { IUserSchema, users } from "@/database/schema/user"

export const authOptions: AuthOptions={
    providers:[
        Credentials({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any){
                if (!credentials.email || !credentials.password){
                    return null
                }
                return signInWithCredentials({email: credentials.email, password: credentials.password})
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID||"",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET||"",
            // authorization: {
            //     request(context){
            //         console.log(context)
            //     },
            //     params: {
            //         prompt: "consent",
            //         access_type: "offline",
            //         response_type: "code",
            //     },
            // }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 60*60*24*30 // 30 days
    },
    callbacks: {
        jwt: async ({token, user}: any)=>{
            if (user){
                token.user=user._doc
                return token;
            }
            else{
                const newUser: IUserSchema|null=await users.findOne({email: token.email?token.email:token.user.email})
                token.user=newUser
                return token;
            }
        },
        session: async ({token, user, session}: any)=>{
            if (token){
                session.user=token.user
            }
            return session
        },
        signIn: async (context)=>{
            if(context.account?.provider==="google"){
                const result=await registerUser({ password: "", email: context.user.email!, firstName: context.user.name!, lastName: "", userName: context.user.id, image: context.user.image! })
                const res=await result?.json()
                if (res.status===200) return true;
                else return false;
            }
            return true
        }
    },
    pages: {
        signIn: "/auth"
    },
}