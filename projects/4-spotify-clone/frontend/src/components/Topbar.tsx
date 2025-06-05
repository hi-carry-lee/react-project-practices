import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  console.log({ isAdmin });

  return (
    <div
      className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10"
    >
      {/* Logo */}
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" className="size-8" alt="Spotify logo" />
        Spotify
      </div>

      {/* User */}
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <LayoutDashboardIcon className="size-4  mr-2" />
            Admin Dashboard
          </Link>
        )}

        {/* 注意这个组件的名称：SignedOut，不是SignOut，它是Clerk提供的条件渲染组件，只在用户未登录时显示内部内容 */}
        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};
export default Topbar;
