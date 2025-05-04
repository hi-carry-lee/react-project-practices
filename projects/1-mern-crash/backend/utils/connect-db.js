// connect to the database
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * 连接 MongoDB 数据库
 * @param {string} uri - MongoDB 连接字符串
 * @param {Object} options - 连接选项
 * @returns {Promise<typeof mongoose>} Mongoose 连接实例
 */
const connectDB = async (uri = process.env.MONGO_URI, options = {}) => {
  try {
    // 设置默认选项
    const defaultOptions = {
      serverSelectionTimeoutMS: 5000, // 服务器选择超时
      socketTimeoutMS: 45000, // 套接字超时
    };

    // 合并选项
    const connectionOptions = { ...defaultOptions, ...options };

    // 连接数据库
    const conn = await mongoose.connect(uri, connectionOptions);

    console.log(`MongoDB 已连接: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB 连接失败: ${error.message}`);

    // 根据应用需求决定是否退出
    // 生产环境可能需要重试而不是直接退出
    if (process.env.NODE_ENV === "development") {
      process.exit(1);
    }

    throw error; // 将错误传递给调用者，便于处理
  }
};

export default connectDB;
