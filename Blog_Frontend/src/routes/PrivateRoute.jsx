import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const PrivateRoute = () => {
  const { user, token, isInitialized } = useAuthStore();

  if (!isInitialized) return null;

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
