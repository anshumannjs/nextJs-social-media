"use server"
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/expressjs_tutorial").then(()=>{
    console.log("connected");
}).catch((err:object)=>{
    console.log(err);
})

declare global{
    var mongoose: {
        conn: mongoose.Mongoose|null,
        promise: Promise<mongoose.Mongoose>|null
    }
}

global.mongoose={
    conn: null,
    promise: null
}

export const connectdb = async ()=>{
    if(global.mongoose && global.mongoose.conn){
        console.log("already connected")
        return global.mongoose.conn
    }
    else{
        const promise=mongoose.connect("mongodb://127.0.0.1:27017/expressjs_tutorial");
        global.mongoose={
            conn: await promise,
            promise: promise
        }
        console.log("connecting to MongoDb")
        return await promise;
    }
}