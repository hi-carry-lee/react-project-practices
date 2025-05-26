import useGetContacts from "../../hooks/useGetContacts";
import { getRandomEmoji } from "../../utils/emojis";
import Contact from "./Contact";

const Contacts = () => {
  const { loading, contacts } = useGetContacts();
  return (
    <div className="py-2 flex flex-col overflow-auto gap-2">
      {contacts.map((contact, idx) => (
        <Contact
          key={contact._id}
          contact={contact}
          emoji={getRandomEmoji()}
          lastIdx={idx === contacts.length - 1}
        />
      ))}

      {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null}
    </div>
  );
};
export default Contacts;
