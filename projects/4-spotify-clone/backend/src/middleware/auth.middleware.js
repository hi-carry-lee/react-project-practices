import { clerkClient } from "@clerk/express";

// 路由保护：认证检查
export const protectRoute = async (req, res, next) => {
  if (!req.auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }
  next();
};

// 权限检查：管理员权限
export const requireAdmin = async (req, res, next) => {
  try {
    // todo：这是AI提的建议，如果JWT中已有角色信息，优先使用（避免API调用）
    if (req.auth.claims?.role === "admin") {
      return next();
    }

    // 如果JWT中没有角色信息，则从数据库中获取
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized - you must be an admin" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
