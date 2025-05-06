import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import connectDB from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";
import cors from "cors";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// add cors middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
// if we want to use cookies, we need to use cookieParser middleware
app.use(cookieParser());
// app.use(fileUpload({ useTempFiles: true }));
app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
