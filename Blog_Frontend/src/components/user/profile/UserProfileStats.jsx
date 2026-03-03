import { useNavigate } from "react-router-dom";

const UserProfileStats = ({ stats, userId = "" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-8 text-center py-4">
      <div>
        <p className="text-xl font-semibold">{stats?.blogs_published}</p>
        <p className="text-sm text-muted-foreground">Posts</p>
      </div>

      <div
        className="cursor-pointer"
        onClick={() => navigate(`/users/${userId}/followers`)}
      >
        <p className="text-xl font-semibold">{stats?.followers}</p>
        <p className="text-sm text-muted-foreground">Followers</p>
      </div>

      <div
        className="cursor-pointer"
        onClick={() => navigate(`/users/${userId}/following`)}
      >
        <p className="text-xl font-semibold">{stats?.following}</p>
        <p className="text-sm text-muted-foreground">Following</p>
      </div>

      <div>
        <p className="text-xl font-semibold">{stats?.total_upvotes}</p>
        <p className="text-sm text-muted-foreground">Upvotes</p>
      </div>

      <div>
        <p className="text-xl font-semibold">{stats?.total_comments}</p>
        <p className="text-sm text-muted-foreground">Comments</p>
      </div>
    </div>
  );
};

export default UserProfileStats;
