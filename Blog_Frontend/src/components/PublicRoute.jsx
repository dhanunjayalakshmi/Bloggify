import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/authStore";

const PublicRoute = () => {
  const user = useAuthStore((state) => state?.user);
  const token = useAuthStore((state) => state?.token);

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
