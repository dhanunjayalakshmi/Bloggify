import FollowButton from "./profile/FollowButton";
import useProfileNavigation from "@/hooks/useProfileNavigation";

const ExploreUserCard = ({ user }) => {
  const goToProfile = useProfileNavigation();

  return (
    <div
      onClick={() => goToProfile(user.id)}
      className="flex items-center justify-between p-4 border rounded-xl bg-white dark:bg-gray-900 hover:shadow cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <img
          src={user.avatar || "/default-avatar.png"}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          {user.bio && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <FollowButton userId={user.id} />
      </div>
    </div>
  );
};

export default ExploreUserCard;
