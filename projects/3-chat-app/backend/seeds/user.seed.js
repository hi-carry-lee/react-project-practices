import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const seedUsers = [
  // Female Users
  {
    username: "emma",
    fullName: "Emma Thompson",
    password: "123456",
    gender: "female",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=emma",
  },
  {
    username: "olivia",
    fullName: "Olivia Miller",
    password: "123456",
    gender: "female",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=olivia",
  },
  {
    username: "sophia",
    fullName: "Sophia Davis",
    password: "123456",
    gender: "female",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=sophia",
  },
  {
    username: "ava",
    fullName: "Ava Wilson",
    password: "123456",
    gender: "female",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=ava",
  },
  {
    username: "bella",
    fullName: "Isabella Brown",
    password: "123456",
    gender: "female",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=bella",
  },
  {
    username: "mia",
    fullName: "Mia Johnson",
    password: "123456",
    gender: "female",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=mia",
  },
  {
    username: "lotte",
    fullName: "Charlotte Williams",
    password: "123456",
    gender: "female",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=lotte",
  },
  {
    username: "amelia",
    fullName: "Amelia Garcia",
    password: "123456",
    gender: "female",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=amelia",
  },

  // Male Users
  {
    username: "james",
    fullName: "James Anderson",
    password: "123456",
    gender: "male",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=james",
  },
  {
    username: "will",
    fullName: "William Clark",
    password: "123456",
    gender: "male",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=will",
  },
  {
    username: "ben",
    fullName: "Benjamin Taylor",
    password: "123456",
    gender: "male",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=ben",
  },
  {
    username: "lucas",
    fullName: "Lucas Moore",
    password: "123456",
    gender: "male",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=lucas",
  },
  {
    username: "henry",
    fullName: "Henry Jackson",
    password: "123456",
    gender: "male",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=henry",
  },
  {
    username: "alex",
    fullName: "Alexander Martin",
    password: "123456",
    gender: "male",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=alex",
  },
  {
    username: "dan",
    fullName: "Daniel Rodriguez",
    password: "123456",
    gender: "male",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=dan",
  },
];

const seedDatabase = async () => {
  try {
    // 因为运行这个文件时，项目还没有启动，所以无法读取.env文件，所以需要直接在代码中指定数据库连接字符串
    await mongoose.connect("mongo db url");

    // Hash passwords before inserting
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.insertMany(hashedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
