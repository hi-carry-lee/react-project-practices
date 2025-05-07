import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
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
      if (res.success) {
        set({ authUser: res.data });
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
      if (res.success) {
        toast.success("Signup successful");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in signup: ", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", formData);
      if (res.success) {
        toast.success("Login successful");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.success) {
        toast.success("Logout successful");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
