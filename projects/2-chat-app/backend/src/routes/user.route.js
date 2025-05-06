import express from "express";
import {
  registerUser,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", login);
userRoutes.post("/logout", protectRoute, logout);
userRoutes.put("/update-profile", protectRoute, updateProfile);
// used for checking if the user is logged in, if not, then redirect to the login page
userRoutes.get("/check", protectRoute, checkAuth);

export default userRoutes;
