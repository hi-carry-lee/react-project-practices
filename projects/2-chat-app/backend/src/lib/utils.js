import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = async (id, res) => {
  const user = await User.findById(id);
  const token = jwt.sign(
    { id: user._id, name: user.name, avatar: user.avatar },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("jwt", token, {
    // prevent XSS attacks
    httpOnly: true,
    // prevent CORS attacks
    secure: process.env.NODE_ENV !== "development",
    // prevent CSRF attacks
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
