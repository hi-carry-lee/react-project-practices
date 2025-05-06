// create a message route for the chat app
import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRoutes = express.Router();

// get users for the sidebar which logged user can see and send message to
messageRoutes.get("/users", protectRoute, getUsersForSidebar);

// get messages between two users
messageRoutes.get("/:id", protectRoute, getMessages);

// send message to a user
messageRoutes.post("/send/:id", protectRoute, sendMessage);

export default messageRoutes;
