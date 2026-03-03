import { useParams, useLocation, useNavigate } from "react-router-dom";
import useFollowList from "@/hooks/useFollowList";
import FollowButton from "@/components/user/profile/FollowButton";

const FollowListPage = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const type = location.pathname.includes("followers")
    ? "followers"
    : "following";

  const { users, loading } = useFollowList(type, userId);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto my-10">
      <h1 className="text-2xl font-bold mb-6 capitalize">{type}</h1>

      {users.length === 0 && (
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
              onClick={() => navigate(`/users/${user.id}`)}
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

            <FollowButton userId={user.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowListPage;
