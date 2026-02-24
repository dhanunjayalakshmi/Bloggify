import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";

const useUserProfile = ({ mode = "self", username } = {}) => {
  const { token, setProfile } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;

        setLoading(true);
        setError(null);

        let endPoint = mode === "self" ? "/users/me" : `/users/${username}`;

        const res = await api.get(endPoint);
        const profile = res?.data;

        if (mode === "self") {
          setProfile(profile);
        }

        setData(profile);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [mode, username, token]);

  return { data, loading, error };
};

export default useUserProfile;
