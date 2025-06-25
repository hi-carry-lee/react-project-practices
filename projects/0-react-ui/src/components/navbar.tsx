import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 absolute top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-lg font-semibold text-gray-800">UI Practice Lab</h1>
      </div>
    </nav>
  );
}

export default Navbar;
