import mongoose, { Document } from "mongoose";

export interface INotificationSchema extends Document{
    recipentArr: string[],
    readUsers: string[],
    unreadUsers: string[],
    sender: string,
    about: string,
    link: string,
    createdAt: Date,
    senderName: string
}

const notificationModel=new mongoose.Schema({
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,      
    },
    senderName: {
        type: mongoose.SchemaTypes.String,
        required: true, 
    },
    recipentArr: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true, 
    },
    readUsers: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
    },
    unreadUsers: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true, 
    },
    about: {
        type: mongoose.SchemaTypes.String,
        required: true, 
    },
    link: {
        type: mongoose.SchemaTypes.String,
        required: true, 
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        default: new Date(),
        expires: 60*60*24 // 1 day
    },
})

export default mongoose.models.notificationModel || mongoose.model<INotificationSchema>("notificationModel", notificationModel)