import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useContact from "../zustand/useContact";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useContact();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      // 为新消息添加shake动画，并播放声音，shake动画在index.css中定义
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages([...messages, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};
export default useListenMessages;
