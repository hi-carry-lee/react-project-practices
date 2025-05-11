import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { devtools } from "zustand/middleware";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create(
  devtools((set, get) => ({
    // Initial states
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    // when refreshing the page, we need to know whether it's checking authentication or not, so we use this state to check, and when it's checking, we can show a loading state
    isCheckingAuth: true,

    // Actions
    setUser: (user) => set({ user }),

    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        if (res.data.success) {
          set({ authUser: res.data.data });
          get().connectSocket();
        }
      } catch (error) {
        console.log("Error in checkAuth: ", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async (formData) => {
      set({ isSigningUp: true });
      try {
        const res = await axiosInstance.post("/auth/signup", formData);
        if (res.data.success) {
          set({ authUser: res.data.data });
        }
        get().connectSocket();
        return { success: true, message: "Signup successful" };
      } catch (error) {
        console.log("Error in signup: ", error);
        return { success: false, message: error.response.data.message };
      } finally {
        set({ isSigningUp: false });
      }
    },

    login: async (formData) => {
      try {
        set({ isLoggingIn: true });
        const res = await axiosInstance.post("/auth/login", formData);
        if (res.data.success) {
          set({ authUser: res.data.data });
          get().connectSocket();
        }
        return { success: true, message: "Login successful" };
      } catch (error) {
        return { success: false, message: error.response.data.message };
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logout: async () => {
      try {
        const res = await axiosInstance.post("/auth/logout");
        if (res.data.success) {
          set({ authUser: null });
          get().disconnectSocket();
        }
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    updateProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        if (res.data.success) {
          set({ authUser: res.data.data });
        }
        return { success: true, message: "Profile updated successfully" };
      } catch (error) {
        console.log("error in update profile:", error);
        return { success: false, message: error.response.data.message };
      } finally {
        set({ isUpdatingProfile: false });
      }
    },
    connectSocket: () => {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) return;

      // 创建一个指向BASE_URL的Socket.IO连接对象，并设置连接参数，包括query对象
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
        // 携带cookie，因为后端需要从cookie中获取token
        withCredentials: true,
      });
      // 通过HTTP请求去建立websocket连接
      socket.connect();

      set({ socket: socket });

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    },
    disconnectSocket: () => {
      if (get().socket?.connected) get().socket.disconnect();
    },
  }))
);
