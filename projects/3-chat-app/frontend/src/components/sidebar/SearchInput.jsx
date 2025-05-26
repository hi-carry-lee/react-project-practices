import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useContact from "../../zustand/useContact";
import useGetContacts from "../../hooks/useGetContacts";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedContact } = useContact();
  const { contacts } = useGetContacts();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = contacts.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedContact(conversation);
      setSearch("");
    } else toast.error("No such user found!");
  };
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search…"
        className="input input-bordered rounded-full h-9"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="p-3 hover:bg-blue-600 hover:text-gray-400 active:bg-blue-500 active:text-gray-300 active:scale-95 duration-200 rounded-full bg-sky-500 text-white"
      >
        {/* outline-none用于在元素获取焦点时，去掉它的轮廓，这里看起来没有效果 */}
        <IoSearchSharp className="size-4 outline-none" />
      </button>
    </form>
  );
};
export default SearchInput;
