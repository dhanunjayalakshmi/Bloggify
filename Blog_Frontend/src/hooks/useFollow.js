import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const useFollow = (userId) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const checkFollow = async () => {
      try {
        const res = await api.get(
          `/follows/is-following?following_id=${userId}`,
        );
        setIsFollowing(res.data.is_following);
      } catch (err) {
        console.error("Follow check error:", err);
      }
    };

    checkFollow();
  }, [userId]);

  const toggleFollow = async () => {
    try {
      setLoading(true);

      await api.post("/follows", {
        following_id: userId,
      });

      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Follow toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, toggleFollow, loading };
};

export default useFollow;
