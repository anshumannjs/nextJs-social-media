import mongoose, {Document, ObjectId} from "mongoose";

export interface IMessageSchema extends Document{
    sender: ObjectId,
    message: string,
    sendAt: Date,
}

export interface IChatRoomContentSchema extends Document{
    users: [ObjectId],
    messages: [IMessageSchema]
}

export const messageModelDb = new mongoose.Schema({
    sender: {
        type: mongoose.SchemaTypes.ObjectId
    },
    message: {
        type: mongoose.SchemaTypes.String
    },
    sendAt: {
        type: mongoose.SchemaTypes.Date,
        default: new Date(),
        required: true
    }
})
export const messageModel=mongoose.models.message || mongoose.model<IMessageSchema>("message", messageModelDb)

const chatRoomContentModel = new mongoose.Schema({
    users: {
        type: [mongoose.SchemaTypes.ObjectId],
    },
    messages: {
        type: [messageModelDb]
    }
})
export const chatRoomContent=mongoose.models.chatRoomContent || mongoose.model<IChatRoomContentSchema>("chatRoomContent", chatRoomContentModel)

// export mongoose.model("messageModel", messageModel)
// export mongoose.model("chatRoomContentModel", chatRoomContentModel)