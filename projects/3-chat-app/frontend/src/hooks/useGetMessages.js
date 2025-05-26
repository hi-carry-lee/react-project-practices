import { useEffect, useState } from "react";
import useContact from "../zustand/useContact";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedContact } = useContact();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedContact._id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedContact?._id) getMessages();
  }, [selectedContact?._id, setMessages]);

  return { messages, loading };
};
export default useGetMessages;
