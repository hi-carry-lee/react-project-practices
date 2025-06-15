import { Navigate, Outlet } from 'react-router-dom';
import useAuthUser from '../../hooks/useAuthUser';
import LoadingSpinner from './LoadingSpinner';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

function ProtectedMainLayout() {
  const { data: authUser, isLoading } = useAuthUser();

  // 加载状态
  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  // 未认证用户重定向到登录页
  if (!authUser) {
    return <Navigate to='/login' replace />;
  }

  // 认证通过，渲染主应用布局
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Outlet />
      <RightPanel />
    </div>
  );
}

export default ProtectedMainLayout;
