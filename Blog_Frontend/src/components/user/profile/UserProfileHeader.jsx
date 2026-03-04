import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

const UserProfileHeader = ({ user, isOwnProfile = false, userId }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 relative">
      <div className="absolute top-0 right-0 hidden md:block">
        {isOwnProfile ? (
          <Link
            to="/profile/edit"
            className="text-sm font-medium bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition"
          >
            Edit Profile
          </Link>
        ) : (
          <FollowButton userId={userId} />
        )}
      </div>

      <img
        src={
          user?.avatar ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGEZghB-stFaphAohNqDAhEaXOWQJ9XvHKJw&s"
        }
        alt={user?.full_name}
        className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
      />
      <div>
        <h2 className="text-2xl font-bold">{user?.full_name}</h2>
        <p className="text-muted-foreground">@{user?.username}</p>
      </div>
      {user?.bio && (
        <p className="max-w-2xl text-md text-gray-600 dark:text-gray-300">
          {user?.bio}
        </p>
      )}

      <div className="md:hidden">
        {isOwnProfile ? (
          <Link
            to="/profile/edit"
            className="text-sm font-medium bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition"
          >
            Edit Profile
          </Link>
        ) : (
          <FollowButton userId={userId} />
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;
