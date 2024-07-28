import mongoose, { Document } from "mongoose";

interface ICommentSchema extends Document{
    userId: string,
    createdAt: Date,
    text: string,
    replies: string[],
    likes: string[],
    postId: string,
    replyTo: string
}

const commentModel=new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        default: new Date()
    },
    text: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    replies: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    },
    postId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    replyTo: {
        type: mongoose.SchemaTypes.ObjectId,
    }
})

export default mongoose.models.commentModel || mongoose.model<ICommentSchema>("commentModel", commentModel)