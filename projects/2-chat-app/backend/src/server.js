import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import connectDB from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

// add cors middleware
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

// Express框架的默认限制：100KB
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
// if we want to use cookies, we need to use cookieParser middleware
app.use(cookieParser());
// app.use(fileUpload({ useTempFiles: true }));
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

server.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
