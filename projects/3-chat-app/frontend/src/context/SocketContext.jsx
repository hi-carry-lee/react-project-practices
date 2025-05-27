import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const SocketContext = createContext();

// 提示：Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.
// 原因：React的Fast Refresh功能要求每个文件只导出组件，因此为了改善热重载性能，建议每个文件只包括一个组件的导出。
// 解决方案 TODO: 将它放在单独的文件中，然后在这里导入
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();
  const socketRef = useRef(null); // 创建一个 ref 来保存 socket 实例

  useEffect(() => {
    if (authUser) {
      // 只有当authUser存在时才连接socket
      socketRef.current = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
      });

      // 设置 socket.on 事件
      socketRef.current.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        // 清理函数
        socketRef.current.close();
        socketRef.current = null; // 清空
      };
    } else {
      // authUser 为空时，如果已连接 socket 则关闭
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }
  }, [authUser]); // 仅依赖 authUser

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
