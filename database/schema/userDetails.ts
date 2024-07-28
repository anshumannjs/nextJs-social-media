import mongoose, {Document, ObjectId} from "mongoose";

import chat, {IChatSchema} from "./chat";

export interface IUserDetailsSchema extends Document {
    followers: string[],
    following: string[],
    chatList: string[],
    userId: string,
    postList: string[],
    savedPosts: string[],
    notifications: string[],
    likes: string[]
}

export const userDetailsModel=new mongoose.Schema({
    followers: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: [],
    },
    chatList: {
        type: [String],
        default: [],
    },
    userId: {
        type: String,
        required: true
    },
    postList: {
        type: [String],
        default: []
    },
    savedPost: {
        type: [String],
        default: []
    },
    notifications: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    }
})

export const userDetails=mongoose.models?.userDetails || mongoose.model<IUserDetailsSchema>("userDetails", userDetailsModel)