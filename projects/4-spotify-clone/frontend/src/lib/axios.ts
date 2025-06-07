import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
});

// 全局token获取函数
let getTokenFunction: (() => Promise<string | null>) | null = null;

/**
 * 设置全局token获取函数
 * 在AuthProvider中调用，将Clerk的getToken函数传递给axios
 */
export const setTokenGetter = (tokenGetter: () => Promise<string | null>) => {
  getTokenFunction = tokenGetter;
};

// 请求拦截器 - 每次请求动态获取最新token
axiosInstance.interceptors.request.use(
  async (config) => {
    // 检查是否已有Authorization头，避免重复设置
    if (!config.headers.Authorization && getTokenFunction) {
      try {
        const token = await getTokenFunction();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to get token in request interceptor:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理token过期和401错误
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 处理401错误且避免无限重试
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 清除可能存在的旧Authorization头
        delete originalRequest.headers.Authorization;

        // 重新获取token
        if (getTokenFunction) {
          const newToken = await getTokenFunction();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error(
          "Token refresh failed in response interceptor:",
          refreshError
        );
        // 可以在这里触发登出逻辑或跳转到登录页
      }
    }

    return Promise.reject(error);
  }
);

/**
 * 调试函数：测试当前token获取是否正常
 * 在开发环境中可以在浏览器控制台调用 window.testClerkToken() 来测试
 */
export const testTokenGetter = async (): Promise<void> => {
  if (!getTokenFunction) {
    console.log("❌ Token getter not set. Make sure AuthProvider has mounted.");
    return;
  }

  try {
    const token = await getTokenFunction();
    if (token) {
      console.log("✅ Token retrieved successfully");
      console.log("Token preview:", token.substring(0, 50) + "...");

      // 解析JWT payload (仅用于调试)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log(
          "Token expires at:",
          new Date(payload.exp * 1000).toLocaleString()
        );
      } catch {
        console.log("Could not parse token payload");
      }
    } else {
      console.log("❌ No token available (user might not be signed in)");
    }
  } catch (error) {
    console.error("❌ Error getting token:", error);
  }
};

// 在开发环境中将测试函数暴露到全局
if (import.meta.env.MODE === "development") {
  (
    window as typeof window & { testClerkToken?: () => Promise<void> }
  ).testClerkToken = testTokenGetter;
}
