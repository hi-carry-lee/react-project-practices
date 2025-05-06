import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "cloudinary";

export const getUsersForSidebar = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const loggedInUserId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId },
        { senderId: receiverId, receiverId: loggedInUserId },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.log("Error in getMessagesBetweenUsers: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat-app",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // realtime functinality from here, use socket.io to send the message to the receiver

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.log("Error in sendMessage: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
