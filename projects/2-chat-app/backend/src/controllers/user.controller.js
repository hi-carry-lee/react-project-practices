import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    await generateToken(newUser._id, res);
    res.status(201).json({
      success: true,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.log("Error in registerUser: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return (
        res
          .status(400)
          // why using invalid credentials instead of invalid email or password? for security reasons
          .json({ success: false, message: "Invalid credentials" })
      );
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    await generateToken(user._id, res);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log("Error in login: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    // const userId = "6818b6e1585007333cb8ca76";
    if (!avatar) {
      return res
        .status(400)
        .json({ success: false, message: "Avatar image is required" });
    }
    const result = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
    });
    const user = await User.findByIdAndUpdate(
      userId,
      {
        avatar: result.secure_url,
        // for now, no need to delete the avatar from cloudinary
        // public_id: result.public_id,
      },
      {
        new: true,
        select: "-password",
      }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log("Error in updateProfile: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    console.log("Error in checkAuth: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { registerUser, login, logout, updateProfile, checkAuth };
