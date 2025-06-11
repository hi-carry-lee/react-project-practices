import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import useAuthUser from "./hooks/useAuthUser";

// AuthLayout component for login/signup pages
function AuthLayout({ children }) {
  const { data: authUser, isLoading } = useAuthUser();

  // If user is already authenticated, redirect to home
  if (!isLoading && authUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {children}
      <Toaster />
    </div>
  );
}

// ProtectedRoute component - handles authentication
function ProtectedRoute() {
  const { data: authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// MainLayout component - handles main app layout
function MainLayout() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Outlet />
      <RightPanel />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* 认证相关路由 */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <SignUpPage />
          </AuthLayout>
        }
      />

      {/* 主应用路由 */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
