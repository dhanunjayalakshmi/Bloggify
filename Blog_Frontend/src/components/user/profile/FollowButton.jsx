import { Button } from "@/components/ui/button";
import useFollow from "@/hooks/useFollow";

const FollowButton = ({ userId }) => {
  const { isFollowing, toggleFollow, loading } = useFollow(userId);

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
