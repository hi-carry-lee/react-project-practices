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

/*
Socket Context的生命周期的描述
1. SocketContextProvider 在main.jsx中被调用，当应用启动时，在 main.jsx 中被渲染；
2. Socket 连接时机：
    应用启动，SocketContextProvider 被渲染
    在useEffect中，只有当 authUser 存在时（用户已登录）才会建立 socket 连接
    使用 useRef 存储 socket 实例，避免重渲染时重新创建连接
3. 清理函数：
    在组件卸载时，关闭 socket 连接，并清空 ref
    在 authUser 不存在时，如果 socket 已连接，则关闭连接
4. 依赖数组：
    仅依赖 authUser，确保只在用户登录时建立连接
5. 组件重渲染：
    当 authUser 发生变化时会触发重渲染（它是依赖数组中的依赖）
    当 onlineUsers 状态更新时会触发重渲染（它是当前组件的 state）
    但 socket 连接本身不会因为重渲染而重新建立，因为使用了 useRef
*/

/*
Socket 连接的安全问题
1. 前端的安全控制：
  依赖 authUser 状态控制 Socket 连接的建立
  未登录用户无法触发连接
  登出时自动断开连接

2. 后端的安全控制：
  通过中间件验证每个连接请求
  可以验证 token、IP、用户权限等
  可以拒绝非法连接

3. 后端校验Token是最核心的安全措施
  练习项目可以不做这个控制，但是实际项目中必须做
*/
