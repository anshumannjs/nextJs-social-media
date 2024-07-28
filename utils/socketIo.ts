import { Server } from "socket.io";

export class Socket {
    io: any;

    constructor(server: any){
        this.io = new Server(server, {
            cors: {
                origin: "*"
            }
        })
    }
}