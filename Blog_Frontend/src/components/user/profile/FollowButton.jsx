// import { Button } from "@/components/ui/button";
// import api from "@/lib/apiClient";
// import { useEffect, useState } from "react";

// const FollowButton = ({ userId, initialFollowing = false }) => {
//   const [isFollowing, setIsFollowing] = useState(initialFollowing);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setIsFollowing(initialFollowing);
//   }, [initialFollowing]);

//   const toggleFollow = async () => {
//     try {
//       setLoading(true);

//       await api.post("/follows", { following_id: userId });

//       setIsFollowing((prev) => !prev);
//     } catch (err) {
//       console.log("Follow Toggle Error ..", err);
//     } finally {
//       setLoading(false);
//     }
//   };

import { Button } from "@/components/ui/button";
import api from "@/lib/apiClient";
import { useEffect, useState } from "react";

const FollowButton = ({
  userId,
  initialFollowing = false,
  hasInitialFollowing = false,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [checkingInitialState, setCheckingInitialState] =
    useState(!hasInitialFollowing);

  useEffect(() => {
    if (!userId) return;

    if (hasInitialFollowing) {
      setIsFollowing(initialFollowing);
      setCheckingInitialState(false);
      return;
    }

    const checkFollowState = async () => {
      try {
        setCheckingInitialState(true);

        const res = await api.get(
          `/follows/is-following?following_id=${userId}`,
        );

        setIsFollowing(res?.data?.is_following);
      } catch (err) {
        console.log("Follow state fetch error:", err);
      } finally {
        setCheckingInitialState(false);
      }
    };

    checkFollowState();
  }, [userId, initialFollowing, hasInitialFollowing]);

  const toggleFollow = async () => {
    try {
      setLoading(true);

      await api.post("/follows", { following_id: userId });

      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.log("Follow toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      onClick={toggleFollow}
      disabled={loading || checkingInitialState}
      className="text-xs"
    >
      {loading || checkingInitialState
        ? "..."
        : isFollowing
          ? "Following"
          : "Follow"}
    </Button>
  );
};

export default FollowButton;
