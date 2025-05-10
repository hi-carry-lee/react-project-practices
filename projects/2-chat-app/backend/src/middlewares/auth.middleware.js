import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // before we get token from cookies, we need to make sure that we have used cookieParser middleware in the server.js file
    const token = req.cookies.jwt;
    // console.log("token: ", token);
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found  " });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
