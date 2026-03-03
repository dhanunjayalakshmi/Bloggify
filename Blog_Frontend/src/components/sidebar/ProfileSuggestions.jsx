import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useProfileSuggestions from "@/hooks/useProfileSuggestions";

const ProfileSuggestions = () => {
  const { users } = useProfileSuggestions(3);
  const navigate = useNavigate();

  if (!users.length) return null;

  return (
    <Card className="dark:bg-gray-800">
      <CardContent className="p-4">
        <h2 className="font-semibold mb-4">Profile Suggestions</h2>

        {users.map((user) => (
          <div
            key={user?.id}
            className="flex items-center justify-between mb-3"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/users/${user?.username}`)}
            >
              <img
                src={user?.avatar || "/placeholder.png"}
                alt={user?.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-medium text-sm">{user?.name}</p>
            </div>

            <Button variant="outline" size="sm" className="text-xs">
              Follow
            </Button>
          </div>
        ))}

        <Button
          className="w-full mt-2 text-sm"
          onClick={() => navigate("/users/explore")}
        >
          See More
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSuggestions;
