import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { devtools } from "zustand/middleware";

export const useAuthStore = create(
  devtools((set) => ({
    // Initial states
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    // when refreshing the page, we need to know whether it's checking authentication or not, so we use this state to check, and when it's checking, we can show a loading state
    isCheckingAuth: true,

    // Actions
    setUser: (user) => set({ user }),

    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        if (res.data.success) {
          set({ authUser: res.data.data });
        }
      } catch (error) {
        console.log("Error in checkAuth: ", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async (formData) => {
      try {
        set({ isSigningUp: true });
        const res = await axiosInstance.post("/auth/signup", formData);
        if (res.data.success) {
          set({ authUser: res.data.data });
        }
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
  }))
);
