import { Link } from "react-router";
import FollowButton from "./FollowButton";

const UserProfileHeader = ({ user, isOwnProfile = false }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 relative">
      <div className="absolute top-0 right-0 hidden md:block">
        {isOwnProfile ? (
          <Link
            to="/account/settings"
            className="text-sm bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700 transition"
          >
            Edit Profile
          </Link>
        ) : (
          <FollowButton isFollowing={user.isFollowing} userId={user.id} />
        )}
      </div>

      <img
        src={user.profile_image}
        alt={user.full_name}
        className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
      />
      <div>
        <h2 className="text-2xl font-bold">{user.full_name}</h2>
        <p className="text-muted-foreground">@{user.username}</p>
      </div>
      {user.bio && (
        <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
          {user.bio}
        </p>
      )}

      <div className="md:hidden">
        {isOwnProfile ? (
          <Link
            to="/account/settings"
            className="text-sm bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700 transition"
          >
            Edit Profile
          </Link>
        ) : (
          <FollowButton isFollowing={user.isFollowing} userId={user.id} />
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;
