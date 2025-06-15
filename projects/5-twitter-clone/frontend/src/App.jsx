import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import AuthLayout from './components/common/AuthLayout';
import ProtectedMainLayout from './components/common/ProtectedMainLayout';

function App() {
  return (
    <>
      <Routes>
        {/* 认证相关路由 */}
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
        </Route>

        {/* 受保护的主应用路由 */}
        <Route element={<ProtectedMainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/notifications' element={<NotificationPage />} />
          <Route path='/profile/:username' element={<ProfilePage />} />
        </Route>

        {/* 404 页面 */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      {/* 全局 Toaster */}
      <Toaster />
    </>
  );
}

export default App;
