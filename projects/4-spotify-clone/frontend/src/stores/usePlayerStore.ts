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
