// import express from 'express'
// import session from "express-session"
// import cookieParser from "cookie-parser"
// import passport from "passport"
// import MongoStore from 'connect-mongo';
// import bodyParser from 'body-parser';
// import cors from "cors"
// import {Server} from "socket.io"
// import http from "http"

// import authRoute from "./auth/route"
// import { Socket } from '@/utils/socketIo';
// import chatRoute from "./chat/route"

// require("./database/index")

// const app=express()
// const PORT: number=3001
// const httpServer = new http.Server(app)
// export const socket = new Socket(httpServer);

// socket.io.on("connection", (e:any)=>{
//     console.log("a user connected", e.id);
//     socket.io.emit("hello")
// })

// app.use(cors({
//     origin: "http://localhost:3000/",
//     credentials: true
// }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }))

// app.use(session({
//     secret: 'SJCUGSJGWUKGUEKGUA',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//         mongoUrl: 'mongodb://127.0.0.1:27017/expressjs_tutorial',
//     }),
// }));

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded());

// app.use(passport.initialize());
// app.use(passport.session());
// require("./stratezies/local")
// require("./stratezies/googleOAuth")

// app.use("/api/auth", authRoute);
// app.use("/api/chat", chatRoute);
// app.get("/", (req, res)=>{
//     res.send(200)
// })

// httpServer.listen(PORT, ()=>{
//     console.log(`running on port http://localhost:${PORT}`)
// })