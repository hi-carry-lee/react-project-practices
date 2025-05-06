import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

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
}));
