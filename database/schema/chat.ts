import mongoose, {Document, ObjectId} from "mongoose";

import {messageModel, IMessageSchema, messageModelDb} from "./chatRoomContent"

export interface IChatSchema extends Document{
    roomName: string,
    messages: IMessageSchema[],
    users: ObjectId[]
}

const chatModel = new mongoose.Schema({
    roomName: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    users: {
        type: [mongoose.SchemaTypes.ObjectId],
    },
    messages: {
        type: [messageModelDb]
    },
})

export default mongoose.models.chatModel || mongoose.model<IChatSchema>("chatModel",chatModel)