import { Button } from "@/components/ui/button";
import useFollow from "@/hooks/useFollow";

const FollowButton = ({ userId }) => {
  const { isFollowing, toggleFollow, loading } = useFollow(userId);

  return (
    // <button
    //   onClick={handleFollowToggle}
    //   className={`px-3 py-1 rounded-md text-sm transition ${
    //     following
    //       ? "bg-gray-300 text-black dark:bg-gray-700 dark:text-white hover:bg-gray-400"
    //       : "bg-orange-600 text-white hover:bg-orange-700"
    //   }`}
    // >
    //   {following ? "Unfollow" : "Follow"}
    // </button>
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
