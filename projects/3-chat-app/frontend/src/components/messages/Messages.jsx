import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();

  useEffect(() => {
    // 这个定时器，不卸载几乎不影响
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // useEffect 里面没用到 messages，为什么加入到依赖数组中？
    // 因为希望它的更新，触发组件re-render，从而实现上面的新消息滚动效果
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}
      {/* loading状态时，显示3个骨架屏 */}
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {/* 非加载状态，且没有消息时，显示提示 */}
      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};
export default Messages;

/*
1. lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  Ref 的"覆盖"行为
    虽然每个消息div都绑定了 lastMessageRef
    但由于 React 的渲染顺序，最后一个元素会覆盖前面的ref赋值
    最终 lastMessageRef.current 指向数组中最后一条消息的 DOM 元素
  更新流程
    新消息到达 → messages数组更新 → 组件重渲染 → 
    lastMessageRef指向新的最后元素 → 100ms后滚动到该元素
  为什么需要100ms延迟？
    React 组件重渲染是异步的
    需要确保新的 DOM 元素已经完全渲染到页面上
  scrollIntoView 的行为
    浏览器原生的 DOM API，将调用该方法的元素滚动到可视区域内
*/
