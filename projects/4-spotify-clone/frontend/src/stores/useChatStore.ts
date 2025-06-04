import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { AxiosError } from "axios";

// 定义错误响应类型
interface ErrorResponse {
  message: string;
}

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: Socket;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        set({ error: errorData.message || "Failed to fetch users" });
      } else if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: "An unknown error occurred" });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();

      socket.emit("user_connected", userId);

      socket.on("users_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("receive_message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on(
        "activity_updated",
        ({ userId, activity }: { userId: string; activity: string }) => {
          set((state) => {
            const newActivities = new Map(state.userActivities);
            newActivities.set(userId, activity);
            return { userActivities: newActivities };
          });
        }
      );

      set({ isConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },

  sendMessage: (receiverId, senderId, content) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit("send_message", { receiverId, senderId, content });
  },

  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        set({ error: errorData.message || "Failed to fetch messages" });
      } else if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: "An unknown error occurred" });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

/*
1️⃣ 关于该store生命周期的描述
  1. 在应用启动时创建该store实例；
      在ESM模块中，当前文件作为一个模块，只要项目中有其他地方import它，则它就会被执行；
      且只执行一次；
  2. 作为全局状态管理，会持续存在于整个应用生命周期
  3. 不会因为组件重渲染而重新创建

2️⃣ 关于socket连接的描述
  1. Socket 实例在该 store 创建时就初始化了
      Socket.IO 默认 autoConnect 为 true，当创建 socket 实例时，会自动尝试建立连接
      而这里在创建Socket实例时设置了 autoConnect: false，所以需要手动调用 connect()

3️⃣ 关于 socket.auth = { userId } 
  1. auth 是 Socket.IO 的内置属性，用于在连接时传递认证信息
  2. 在前端通过 socket.auth 来添加认证数据；
  3. 后端在收到连接请求时，会从socket.handshake.auth;获取数据
  4. 其他的 内置属性还有：
    socket.handshake.query;  // 查询参数
    socket.handshake.headers;  // 请求头
  5. 为什么选用 socket.auth 来传递认证信息？
    在连接建立时就被传递，比 query 参数更安全（不会出现在 URL 中）
    是 Socket.IO 推荐的做法
  6. 后端为什么是socket.handshake?
    当客户端调用 socket.connect() 时，会发起一个握手请求;
    所有的数据，都是通过握手请求传递的

4️⃣ 关于 socket 关闭连接
  1. socket.close() 是 socket.disconnect() 的别名，它们都会：
    关闭 WebSocket 连接
    停止重连尝试
    清理所有事件监听器
    将 socket 状态设置为 disconnected
  2. 为什么会有两个名字：
    disconnect() 是 Socket.IO 的官方方法名
    close() 是为了与 WebSocket API 保持一致（WebSocket 使用 close()）
    它们是完全相同的方法，只是名字不同

*/
