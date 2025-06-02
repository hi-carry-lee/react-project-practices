import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
      } catch (error: unknown) {
        // TypeScript将catch中的error设计为unknown，正是为了类型安全
        updateApiToken(null);
        console.log(
          "Error in auth provider",
          error instanceof Error ? error.message : error
        );
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getToken]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-12 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};
export default AuthProvider;
