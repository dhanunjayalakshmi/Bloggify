import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Label htmlFor="profile-visibility">Make profile public</Label>
          <Switch id="profile-visibility" />
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="newsletter">Newsletter</Label>
            <Switch id="newsletter" />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="blog-activity">Blog Activity</Label>
            <Switch id="blog-activity" />
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="new-comments">New Comments</Label>
            <Switch id="new-comments" />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="new-followers">New Followers</Label>
            <Switch id="new-followers" />
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Login & Security</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full">
            <Label
              htmlFor="email"
              className="w-full md:w-40 text-md font-medium"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@gmail.com"
              className="w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full">
            <Label
              htmlFor="password"
              className="w-full md:w-40 text-md font-medium"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="w-full flex justify-end">
            <Button variant="outline">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            Request Data Export
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
