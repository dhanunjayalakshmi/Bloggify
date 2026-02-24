import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import { useParams } from "react-router";

const useUserProfile = () => {
  const { token, setProfile } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  console.log(userId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;

        setLoading(true);
        setError(null);

        let endPoint = userId ? `/users/${userId}` : "/users/me";

        const res = await api.get(endPoint);
        const profile = res?.data;

        if (!userId) {
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
  }, [userId, token]);

  return { data, loading, error };
};

export default useUserProfile;
