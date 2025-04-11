import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/features.js";
import { Server } from "socket.io";
import { createServer } from "http";
import {v4 as uuid} from "uuid";

import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import adminRoute from "./routes/admin.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { create } from "domain";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adminsecretkey";
const userSocketIDs = new Map(); 

connectDB(mongoURI);

const app = express();
const server = createServer(app);
const io = new Server(server,{});

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


io.on("connection", (socket) => {
  const user = {
    _id:"awds",
    name:"Aman"
  };
  userSocketIDs.set(user._id.toString(),socket.id);

  console.log(userSocketIDs);

  socket.on(NEW_MESSAGE,async({chatId,members,message})=>{

    const messageForRealTime = {
      content:message,
      _id:uuid(),
      sender:{
        _id:user._id,
        name:user.name
      },
      chat:chatId,
      createdAt:new Date().toISOString(),
    };

    const messageForDb = {
      content:message,
      chat:chatId,
      sender:user._id,
    }

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE,{
      chatId,
      message:messageForRealTime
    })
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{
      chatId
    })

    try {
      await Message.create(messageForDb);
    } catch (error) {
      console.log(error);
    }
    
  })

  socket.on("disconnect",()=>{
    console.log("User Disconnected");
    userSocketIDs.delete(user._id.toString());
  })
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${envMode} mode`
  );
});

export { envMode, adminSecretKey, userSocketIDs };
