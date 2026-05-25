import { useParams, useLocation } from "react-router-dom";
import useFollowList from "@/hooks/useFollowList";
import FollowButton from "@/components/user/profile/FollowButton";
import useProfileNavigation from "@/hooks/useProfileNavigation";
import { useAuthStore } from "@/stores/authStore";

const FollowListSkeleton = () => (
  <div className="max-w-2xl mx-auto my-10 animate-pulse">
    <div className="h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between border p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const FollowListPage = () => {
  const { userId } = useParams();
  const location = useLocation();
  const goToProfile = useProfileNavigation();

  const type = location.pathname.includes("followers")
    ? "followers"
    : "following";

  const { users, loading } = useFollowList(type, userId);
  const currentUserId = useAuthStore((state) => state.profile?.id);

  if (loading) return <FollowListSkeleton />;

  return (
    <div className="max-w-2xl mx-auto my-10">
      <h1 className="text-2xl font-bold mb-6 capitalize">{type}</h1>

      {users?.length === 0 && (
        <p className="text-muted-foreground">No {type} found.</p>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border p-4 rounded-lg"
          >
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => goToProfile(user?.id)}
            >
              <img
                src={user.avatar || "/placeholder.png"}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </div>

            {user?.id !== currentUserId && (
              <FollowButton
                userId={user?.id}
                initialFollowing={user?.is_following}
                hasInitialFollowing={true}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowListPage;
