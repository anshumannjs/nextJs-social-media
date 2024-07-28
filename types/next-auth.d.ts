import NextAuth from "next-auth/next";
import { IUser } from ".";

declare module "next-auth"{
    interface Session{
        user: IUser
    }
}