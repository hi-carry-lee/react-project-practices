import Contacts from "./Contacts";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <SearchInput />
      <div
        // divider：看似效果是一条线，实际它有margin-top和margin-bottom
        className="divider px-3"
      ></div>
      <Contacts />
      <LogoutButton />
    </div>
  );
};
export default Sidebar;
