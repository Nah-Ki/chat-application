import {Server, Socket} from "socket.io"
import prisma from "./config/db.config.js";
import { produceMessage } from "./helper.js";


interface CustomSocket extends Socket { 
  room?:string;
}

export function setupSocket(io:Server){
  
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if(!room){
      return next(new Error("Invalid room id"));
    }

    socket.room = room;
    next();
  })

  io.on("connection", (socket: CustomSocket) => {

    // * Client joins the room
    socket.join(socket.room) 

    console.log("The socket has connected...", socket.id);

    socket.on("message", async (data) => {
      console.log("The server side message", data);
      // socket.broadcast.emit("message", data);
      
      await produceMessage("chats", data)
      socket.to(socket.room).emit("message", data);
    })

    socket.on("disconnect",()=>{
      console.log("The socket has disconnected...", socket.id);
    })

  })
}
