import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user, token, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (!user || !token) {
      navigate("/", { replace: true });
    }
  }, [user, token, isInitialized, navigate]);
};

export default useAuthRedirect;
