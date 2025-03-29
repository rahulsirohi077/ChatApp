import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroups, sendAttachment } from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();


// after here user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new",newGroupChat);

app.get("/my",getMyChats);

app.get("/my/groups",getMyGroups);

app.put("/addmembers",addMembers);

app.put("/removemember",removeMember);

app.delete("/leave/:id",leaveGroup);

// Send Attachments 
app.post("/message",attachmentsMulter,sendAttachment);

// Get Messages
app.get("/message/:id",getMessages);


// Get Chat Details, rename, delete
app.route("/:id").get(getChatDetails).put(renameGroups).delete(deleteChat);

export default app;
