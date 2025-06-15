import { Navigate, Outlet } from 'react-router-dom';
import useAuthUser from '../../hooks/useAuthUser';

// 认证布局组件
function AuthLayout() {
  const { data: authUser, isLoading } = useAuthUser();

  if (!isLoading && authUser) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen'>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
