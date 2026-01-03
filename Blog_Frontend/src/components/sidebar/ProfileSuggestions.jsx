import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const ProfileSuggestionItem = () => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <img
          src="avatar-placeholder.png"
          alt="user"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-medium text-sm">User Name</p>
      </div>
      <Button size="sm" className="text-xs">
        Follow
      </Button>
    </div>
  );
};

const ProfileSuggestions = () => {
  return (
    <Card className="w-full dark:bg-gray-800 dark:text-gray-200">
      <CardContent className="p-4">
        <h2 className="font-semibold mb-4">Profile Suggestions</h2>
        {[1, 2, 3].map((item) => (
          <ProfileSuggestionItem key={item} />
        ))}
        <Button className="w-full mt-2 text-sm">See More</Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSuggestions;
