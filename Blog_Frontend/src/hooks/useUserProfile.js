import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import { useParams } from "react-router";

const useUserProfile = () => {
  const isInitialized = useAuthStore((state) => state?.isInitialized);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    if (!isInitialized || !userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${userId}`);
        setData(res?.data);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isInitialized]);

  return { data, loading };
};

export default useUserProfile;
