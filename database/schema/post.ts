import mongoose, {Document, ObjectId} from "mongoose";

export interface IPostSchema extends Document{
    caption: string,
    tags: string[],
    imageUrl: string[],
    location: string,
    userId: ObjectId,
    name: string,
    likes: ObjectId[],
    views: ObjectId[],
    createdAt: Date,
    bookMarks: ObjectId[]
}

const postModel=new mongoose.Schema({
    caption: {
        type: mongoose.SchemaTypes.String
    },
    tags: {
        type: [mongoose.SchemaTypes.String]
    },
    imageUrl: {
        type: [mongoose.SchemaTypes.String],
        required: true
    },
    location: {
        type: mongoose.SchemaTypes.String
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    },
    views: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    },
    name: {
        type: mongoose.SchemaTypes.String,
        default: ""
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        default: new Date()
    },
    bookMarks: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    },
})

export default mongoose.models.postModel || mongoose.model<IPostSchema>("postModel", postModel)