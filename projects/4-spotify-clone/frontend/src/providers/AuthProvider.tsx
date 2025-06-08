import { setTokenGetter } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

/*
当前组件在 main.tsx中，随着应用启动，会执行以下操作：
  1. 设置token获取函数到Axios拦截器，动态获取最新Token；
  2. 在应用启动时，通过clerk提供的hook获取Token验证登录状态
  3. 检查当前登录用户是否是管理员
  4. 初始化socket
  5. 在组件卸载时，断开socket
  
  注意：现在不再手动设置Authorization头，而是通过拦截器动态获取token
*/

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    // 设置全局token获取函数到axios拦截器
    setTokenGetter(getToken);

    const initAuth = async () => {
      try {
        // 验证当前登录状态
        const token = await getToken();
        if (token) {
          await checkAdminStatus();
          // init socket
          if (userId) initSocket(userId);
        }
      } catch (error: unknown) {
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
