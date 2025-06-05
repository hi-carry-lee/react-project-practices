import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApiError } from "@/types";
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// 处理错误类型
export const handleAxiosError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // 处理 Axios 错误
    const apiError = error.response?.data as ApiError;
    return apiError?.message || error.message;
  }

  if (error instanceof Error) {
    // 处理普通错误
    return error.message;
  }

  // 处理未知错误
  return "An unexpected error occurred";
};
