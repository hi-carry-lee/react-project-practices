import { useSocketContext } from "../../context/SocketContext";
import useContact from "../../zustand/useContact";

const Contact = ({ contact, lastIdx, emoji }) => {
  const { selectedContact, setSelectedContact } = useContact();

  const isSelected = selectedContact?._id === contact._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(contact._id);

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-400" : ""}
			`}
        onClick={() => setSelectedContact(contact)}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-8 rounded-full">
            <img src={contact.profilePic} alt="user avatar" />
          </div>
        </div>

        <div
          // flex-1 make the div occupy all the available space
          className="flex-1 flex items-center gap-3 justify-between"
        >
          <p className="text-gray-200 text-sm">{contact.fullName}</p>
          <span className="text-md">{emoji}</span>
        </div>
      </div>

      {/* 🚩如果不是最后一个，则显示一条线 */}
      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};
export default Contact;
