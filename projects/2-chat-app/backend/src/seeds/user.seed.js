import connectDB from "../lib/connectDB.js";
import User from "../models/user.model.js";

const seedUsers = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    name: "Emma Thompson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.miller@example.com",
    name: "Olivia Miller",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.davis@example.com",
    name: "Sophia Davis",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.wilson@example.com",
    name: "Ava Wilson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabella.brown@example.com",
    name: "Isabella Brown",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "mia.johnson@example.com",
    name: "Mia Johnson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte.williams@example.com",
    name: "Charlotte Williams",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "amelia.garcia@example.com",
    name: "Amelia Garcia",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    email: "james.anderson@example.com",
    name: "James Anderson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "william.clark@example.com",
    name: "William Clark",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "benjamin.taylor@example.com",
    name: "Benjamin Taylor",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "lucas.moore@example.com",
    name: "Lucas Moore",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henry.jackson@example.com",
    name: "Henry Jackson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "alexander.martin@example.com",
    name: "Alexander Martin",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "daniel.rodriguez@example.com",
    name: "Daniel Rodriguez",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
// 应该在项目的根目录下运行这个文件：node src/seeds/user.seed.js
// 如果在seeds目录下运行，则Node.js 无法正确解析相对路径 ../lib/connectDB.js，因为当前工作目录已经变成了 seeds 目录。
seedDatabase();
