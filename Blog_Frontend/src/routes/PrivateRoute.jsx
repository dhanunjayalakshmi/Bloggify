import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const PrivateRoute = () => {
  const { user, token, isInitialized } = useAuthStore();

  // Auth not yet confirmed — if we have persisted credentials hold the render,
  // otherwise redirect immediately. This prevents the landing page flash.
  if (!isInitialized) {
    return user && token ? null : <Navigate to="/" replace />;
  }

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
