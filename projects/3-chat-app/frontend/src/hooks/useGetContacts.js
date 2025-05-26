import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetContacts = () => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  // 此时useEffect的执行适合和在组件中一致，即：
  // 使用该custom hook的组件首次渲染，以及后续dependency array中的值发生变化时执行
  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setContacts(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, contacts };
};
export default useGetContacts;
