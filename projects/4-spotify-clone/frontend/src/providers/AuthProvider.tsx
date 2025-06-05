import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

/*
当前组件在 main.tsx中，随着应用启动，会执行以下操作：
  1. 统一设置Axios请求头中的Authorization字段，以携带Token；
  2. 在应用启动时，通过clerk提供的hook获取Token
  3. 检查当前登录用户是否是管理员
  4. 初始化socket
  5. 在组件卸载时，断开socket
*/
const updateApiToken = (token: string | null) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdminStatus();
          // init socket
          // if (userId) initSocket(userId);
        }
      } catch (error: unknown) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // clean up
    return () => disconnectSocket();
  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-12 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};
export default AuthProvider;
