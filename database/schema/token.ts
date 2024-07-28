import mongoose, {Document, ObjectId} from "mongoose";

export interface IToken extends Document{
    userId: ObjectId,
    token: string,
    createdAt: Date
}

const tokenSchema=new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    token: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        default: Date.now,
        expires: 3600,
        required: true,
    }
})

export const tokenModel=mongoose.models.tokenModel || mongoose.model<IToken>("tokenModel", tokenSchema)