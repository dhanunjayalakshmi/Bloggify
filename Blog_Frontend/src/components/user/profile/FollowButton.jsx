import { Button } from "@/components/ui/button";
import api from "@/lib/apiClient";
import { useEffect, useState } from "react";

const FollowButton = ({ userId, initialFollowing = false }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const toggleFollow = async () => {
    try {
      setLoading(true);

      await api.post("/follows", { following_id: userId });

      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.log("Follow Toggle Error ..", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      onClick={toggleFollow}
      disabled={loading}
      className="text-xs"
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
