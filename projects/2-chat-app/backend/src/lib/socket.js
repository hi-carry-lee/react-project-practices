import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

// 存储在线用户
// TODO：使用Map或者Redis来存储在线用户
const userSocketMap = {}; // {userId: socketId}

const connectionsPerIP = new Map(); // IP地址 -> {count: 连接次数, timestamp: 最后连接时间}
const MAX_CONNECTIONS_PER_IP = 10; // 每个IP最大允许的连接数
const RATE_LIMIT_WINDOW = 60000; // 速率限制窗口期(毫秒)

// 创建Socket.IO服务器
const io = new Server(server, {
  // ===== 新增：增强CORS配置 =====
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "https://yourproductionapp.com"
        : ["http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  // 增强的安全配置
  maxHttpBufferSize: 1e6, // 1MB
  pingTimeout: 30000,
  pingInterval: 25000,
  transports: ["websocket", "polling"], // 优先使用websocket
});

// !重要：验证中间件必须在connection监听之前定义
// 获取token进行校验和速率限制等代码来自AI，待验证
io.use(async (socket, next) => {
  console.log("尝试建立socket连接 ID:", socket.id);

  try {
    // ===== 新增：速率限制检查 =====
    const clientIP = socket.handshake.address || "未知IP";
    console.log("客户端IP:", clientIP);

    // 获取当前IP的连接信息
    const ipInfo = connectionsPerIP.get(clientIP) || {
      count: 0,
      timestamp: Date.now(),
    };
    const currentTime = Date.now();

    // 检查是否在时间窗口内
    if (currentTime - ipInfo.timestamp > RATE_LIMIT_WINDOW) {
      // 超过窗口期，重置计数
      ipInfo.count = 1;
      ipInfo.timestamp = currentTime;
    } else {
      // 在窗口期内，增加计数
      ipInfo.count += 1;
    }

    // 更新IP信息
    connectionsPerIP.set(clientIP, ipInfo);

    // 检查是否超过限制
    if (ipInfo.count > MAX_CONNECTIONS_PER_IP) {
      console.log(`IP ${clientIP} 连接过于频繁，已拒绝`);
      return next(new Error("连接频率过高，请稍后再试"));
    }

    console.log("检查认证信息...");
    console.log("请求头:", Object.keys(socket.handshake.headers));
    console.log("查询参数:", socket.handshake.query);

    // ===== 新增：从Cookie中提取并验证JWT令牌 =====
    let userId = null;
    let user = null;

    // 1. 首先尝试从Cookie中获取JWT并验证 (优先使用这种更安全的方式)
    if (socket.handshake.headers.cookie) {
      console.log("正在从Cookie中提取JWT...");
      // 正确解析所有cookies
      const cookies = socket.handshake.headers.cookie
        .split(";")
        .reduce((acc, cookie) => {
          const parts = cookie.trim().split("=");
          if (parts.length >= 2) {
            const key = parts[0].trim();
            // 合并剩余部分为值 (处理值中包含=的情况)
            const value = parts.slice(1).join("=");
            acc[key] = value;
          }
          return acc;
        }, {});

      // 检查是否存在jwt cookie
      if (cookies.jwt) {
        console.log("在Cookie中找到JWT令牌");
        try {
          // 验证JWT
          const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
          console.log("JWT验证成功, 用户ID:", decoded.id);

          // 查找用户
          user = await User.findById(decoded.id).select("-password");
          if (user) {
            console.log("从JWT中识别用户:", user._id);
            userId = user._id.toString();
            socket.user = user;
          } else {
            console.log("JWT包含的用户ID在数据库中不存在");
          }
        } catch (jwtError) {
          console.log("JWT验证失败:", jwtError.message);
          // 继续尝试其他认证方式
        }
      }
    }
    // ===== 新增结束 =====

    // 2. 如果JWT验证失败，尝试从查询参数获取userId (回退方案)
    if (!userId && socket.handshake.query.userId) {
      console.log("从查询参数中获取userId (JWT验证不成功)");
      const queryUserId = socket.handshake.query.userId;

      // 可选：验证用户ID是否存在于数据库
      try {
        user = await User.findById(queryUserId).select("-password");
        if (user) {
          console.log("查询参数中的用户ID验证成功");
          userId = queryUserId;
          socket.user = user;
        } else {
          console.log("警告：查询参数中的用户ID在数据库中不存在");
          userId = queryUserId; // 仍使用查询参数中的ID以保持消息传递(虽然不安全)
        }
      } catch (dbError) {
        console.log("查询用户时出错:", dbError.message);
        userId = queryUserId; // 仍使用查询参数中的ID以保持消息传递(虽然不安全)
      }
    }

    // 设置socket.userId (如有)
    if (userId) {
      socket.userId = userId;
      console.log("已设置连接的用户ID:", userId);
    } else {
      console.log("未能识别用户，继续允许连接");
    }

    // 允许连接继续
    next();
  } catch (error) {
    console.error("中间件处理错误:", error);
    next(); // 允许连接以防止服务中断
  }
});

// ===== 新增：定期清理速率限制数据 =====
setInterval(() => {
  const currentTime = Date.now();
  connectionsPerIP.forEach((info, ip) => {
    if (currentTime - info.timestamp > RATE_LIMIT_WINDOW) {
      connectionsPerIP.delete(ip);
    }
  });
  console.log(
    `已清理过期的速率限制数据，当前跟踪的IP数: ${connectionsPerIP.size}`
  );
}, RATE_LIMIT_WINDOW); // 每个时间窗口清理一次
// ===== 新增结束 =====

// 连接事件处理
io.on("connection", (socket) => {
  console.log("用户已连接:", socket.id);

  // 使用中间件中设置的socket.userId (确保一致性)
  const userId = socket.userId;

  if (userId) {
    console.log("已认证用户:", userId);
    userSocketMap[userId] = socket.id;

    // 广播在线用户列表
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("当前在线用户:", Object.keys(userSocketMap));
  } else {
    console.log("未认证用户连接");
  }

  // ===== 新增：更丰富的错误处理 =====
  socket.on("error", (error) => {
    console.error(`Socket错误(${socket.id}):`, error);
    // 清理资源
    if (socket.userId) {
      delete userSocketMap[socket.userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
  // ===== 新增结束 =====

  socket.on("disconnect", () => {
    console.log("用户断开连接:", socket.id);

    // 安全检查: 确保userId存在
    if (socket.userId) {
      delete userSocketMap[socket.userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log("已从在线列表移除用户:", socket.userId);
    }
  });
});

// 获取用户socketId的辅助函数
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io, app, server };
