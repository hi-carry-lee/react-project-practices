import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    // mt-auto：当一个元素在 Flexbox 容器中时，使用 margin-top: auto; 可以将该元素推到父容器的底部，它的高度由内容决定
    // 在整个侧边栏中，logout按钮会处在最底部
    <div className="mt-auto">
      {!loading ? (
        <BiLogOut
          className="w-6 h-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300 active:scale-85 duration-200"
          onClick={logout}
        />
      ) : (
        <span className="loading loading-spinner"></span>
      )}
    </div>
  );
};
export default LogoutButton;
