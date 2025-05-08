import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      // daisyUI中，base就是主题的颜色，fixed属性是为了让NavBar始终在顶部，防止X轴滚动
      // fixed暂时不放上去
      className="border-b border-base-300/80 top-0 
    backdrop-blur-lg "
    >
      <div
        // 使用Tailwind的container类，可以自动适配屏幕宽度
        className="container mx-auto px-4 h-16"
      >
        <div className="flex items-center justify-between h-full">
          {/* left side: Logo and App Name */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              {/* 这个div是为了给Icon添加背景效果，以及背景的圆角效果，背景框的大小由size-9决定 */}
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          {/* Right side: Settings, Profile, Logout */}
          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                {/* btn: 让Link组件得到Btn的效果， btn-sm：因为默认的Btn比较大，通过该属性修改大小； */}
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center btn btn-sm"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
