import mongoose, {Document, ObjectId} from "mongoose";

export interface IOtpGenerationSchema extends Document{
    userId: ObjectId,
    otp: number
}

const optGenerationSchema=new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    otp: {
        type: mongoose.SchemaTypes.Number
    }
})

export default mongoose.models.otpSchema || mongoose.model<IOtpGenerationSchema>("otpSchema", optGenerationSchema)