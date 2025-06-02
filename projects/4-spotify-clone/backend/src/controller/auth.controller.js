import { User } from "../models/user.model.js";

// every time a user signs in with clerk, this function will be called
// ! req, res 参数的顺序不能颠倒
export const authCallback = async (req, res) => {
  try {
    // get user info from clerk
    const { id, firstName, lastName, imageUrl } = req.body;
    const user = await User.findOne({ clerkId: id });
    if (!user) {
      const newUser = new User({
        fullName: `${firstName} ${lastName}`,
        imageUrl,
        clerkId: id,
      });
      await newUser.save();
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
