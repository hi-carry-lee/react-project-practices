import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Contact = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-400" : ""}
			`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-8 rounded-full">
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>

        <div
          // flex-1 make the div occupy all the available space
          className="flex-1 flex items-center gap-3 justify-between"
        >
          <p className="text-gray-200 text-sm">{conversation.fullName}</p>
          <span className="text-md">{emoji}</span>
        </div>
      </div>

      {/* 🚩如果不是最后一个，则显示一条线 */}
      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};
export default Contact;
