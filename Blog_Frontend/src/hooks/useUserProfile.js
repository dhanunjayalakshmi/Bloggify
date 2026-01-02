import { useEffect } from "react";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";

const useUserProfile = () => {
  const { user, token, setProfile } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !token) return;

        const res = await api.get(`/users/${user?.id}`);

        const profile = res?.data;
        if (profile) {
          setProfile(profile);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchProfile();
  }, [user, token]);
};

export default useUserProfile;
