import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";
import { Socket } from "socket.io-client";

// 类型安全的 auth 获取函数
const getSocketAuth = (socket: Socket): { userId: string } | null => {
  // Socket.IO 的 auth 属性类型是 { [key: string]: any }
  const auth = socket.auth;

  if (auth && typeof auth === "object" && "userId" in auth) {
    // 确保 userId 是字符串
    const userId = auth.userId;
    if (typeof userId === "string") {
      return { userId };
    }
  }

  return null;
};

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

// 抽取公共的活动更新逻辑
const emitActivityUpdate = (activity: string) => {
  const socket = useChatStore.getState().socket;
  const auth = getSocketAuth(socket);

  if (auth) {
    socket.emit("update_activity", {
      userId: auth.userId,
      activity,
    });
  }
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];
    emitActivityUpdate(`Playing ${song.title} by ${song.artist}`);

    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    emitActivityUpdate(`Playing ${song.title} by ${song.artist}`);

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    const currentSong = get().currentSong;

    const activity =
      willStartPlaying && currentSong
        ? `Playing ${currentSong.title} by ${currentSong.artist}`
        : "Idle";

    emitActivityUpdate(activity);
    set({ isPlaying: willStartPlaying });
  },

  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      emitActivityUpdate(`Playing ${nextSong.title} by ${nextSong.artist}`);

      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      emitActivityUpdate("Idle");
      set({ isPlaying: false });
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      emitActivityUpdate(`Playing ${prevSong.title} by ${prevSong.artist}`);

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      emitActivityUpdate("Idle");
      set({ isPlaying: false });
    }
  },
}));

/*
关于 socket 的 auth 属性，以及 auth中的userId的说明
1. 为什么 useChatStore 不需要严格类型检查：
    它是在连接建立时设置 userId
    这个值来自用户登录状态
    在连接建立时，这个值一定是存在的
    如果值不存在，连接就不会建立

2. 为什么 usePlayerStore 中对socket.auth.userId 执行类型检查：
    usePlayerStore 需要确保 userId 存在且类型正确
    因为它要使用这个值来发送活动更新
    如果 userId 不存在或类型错误，可能会导致运行时错误

3. 也可以在 useChatStore 中对 socket.auth.userId 执行类型检查，而业界对 TypeScript 类型处理的最佳实践中，关于类型定义的位置：
    在数据源头定义类型（推荐）
    在使用点进行类型检查（备选）（比如在 usePlayerStore 中）
    在共享的 types 文件中定义（最佳）（比如在 types/socket.d.ts 中）

4. 为什么可以在不同位置去处理类型？
    TypeScript 是后添加的类型系统，只要满足类型检查，就可以在不同位置去处理类型；

5. 关于类型检查的时机：
    没有一个明确的标准，可以参考的有：
      项目的规范；
      项目的大小；
      是否是维护已有项目；（原先没有类型，或者类型不完善，就适合在使用处检查类型）


*/
