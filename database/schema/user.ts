import mongoose, {Document, ObjectId} from "mongoose";

import { userDetails, IUserDetailsSchema, userDetailsModel } from "./userDetails.ts";

export interface IUserSchema extends Document{
    email: string,
    password?: string,
    createdAt?: Date,
    firstName: string,
    lastName?: string,
    image?: string,
    userName: string,
    googleId?: string,
    userDetails: ObjectId,
    verified: boolean,
    bio: string
}

export interface ISessionSchema extends Document{
    _id: string,
    userId: ObjectId,
    email: string,
    activeExpires: number,
    idleExpires: number
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(),
    },
    firstName: {
        type: String,
        required: true,
        default: "",
    },
    lastName: {
        type: String,
    },
    image: {
        type: String,
        default: '',
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
    },
    userDetails: {
        type: String,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    bio: {
        type: String,
        default: ""
    }
})

const sessionSchema=new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    activeExpires: {
        type: Number,
        required: true,
    },
    idleExpires: {
        type: Number,
        required: true,
    }
})

export const users= mongoose.models?.users || mongoose.model<IUserSchema>("users", UserSchema);
export const session=mongoose.models?.session || mongoose.model<ISessionSchema>("session", sessionSchema)
// module.exports = mongoose.model("users", UserSchema);