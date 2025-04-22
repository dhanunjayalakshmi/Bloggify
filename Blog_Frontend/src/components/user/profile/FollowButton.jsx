import { useState } from "react";

const FollowButton = ({ isFollowing, userId }) => {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowToggle = () => {
    console.log(userId);
    setFollowing(!following);
  };

  return (
    <button
      onClick={handleFollowToggle}
      className={`px-3 py-1 rounded-md text-sm transition ${
        following
          ? "bg-gray-300 text-black dark:bg-gray-700 dark:text-white hover:bg-gray-400"
          : "bg-orange-600 text-white hover:bg-orange-700"
      }`}
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
