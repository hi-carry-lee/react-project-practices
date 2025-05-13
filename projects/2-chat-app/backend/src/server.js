import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import connectDB from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5000;

// add cors middleware
app.use(
  cors({
    // no need to change the origin, since we will deploy the frontend and backend in the same server
    // it we want to deploy the frontend and backend in different servers, we need to change the origin to the frontend server's url
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

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  // make the frontend build folder as the static folder
  // notice that the path is ../frontend/dist, it's not the same as 1-mern-crash project, since the project structure is different
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
  );
}

server.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
