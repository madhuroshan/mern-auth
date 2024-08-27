import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import { Toaster } from "react-hot-toast";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";

//protect routes that require authentication
const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

//redirect authentcated users to home page
const RedirectAuthenticatedUsers = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { checkAuth, isCheckingAuth, isAuthenticated, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectRoute>
              <DashboardPage />
            </ProtectRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUsers>
              <SignupPage />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUsers>
              <LoginPage />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUsers>
              <VerifyEmailPage />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUsers>
              <ForgotPassword />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUsers>
              <ResetPasswordPage />
            </RedirectAuthenticatedUsers>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
