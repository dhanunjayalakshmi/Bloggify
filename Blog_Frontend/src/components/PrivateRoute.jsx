import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/authStore";

const PrivateRoute = () => {
  const user = useAuthStore((state) => state?.user);
  const token = useAuthStore((state) => state?.token);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
