import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/update-profile", protectRoute, updateProfile);

export default router;
