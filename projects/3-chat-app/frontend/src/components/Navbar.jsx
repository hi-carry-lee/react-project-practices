import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
const Navbar = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="bg-slate-500 px-20 py-2 mb-2 fixed w-full backdrop-filter backdrop-blur-sm bg-opacity-20">
      <div className="container mx-auto flex justify-between items-center text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl w-10 h-10 bg-amber-400 flex justify-center items-center rounded-full">
            📣
          </div>
          <p className="text-xl font-bold">Chatty</p>
        </Link>

        <div className="flex items-center gap-4">
          <div className="rounded-full overflow-hidden w-8 h-8">
            <img src={authUser.profilePic} alt="avatar" />
          </div>
          <Link to="/profile">{authUser.fullName}</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
