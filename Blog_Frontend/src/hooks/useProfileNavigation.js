import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const useProfileNavigation = () => {
  const navigate = useNavigate();
  const profile = useAuthStore((state) => state.profile);

  const goToProfile = (userId) => {
    if (!userId) return;

    if (profile?.id === userId) {
      navigate("/profile");
    } else {
      navigate(`/users/${userId}`);
    }
  };

  return goToProfile;
};

export default useProfileNavigation;
