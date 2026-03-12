import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import UpdatePassword from "../Auth/UpdatePassword";

const SettingsPage = () => {
  const { user, profile, logout, setProfile } = useAuthStore();

  const [isPublic, setIsPublic] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsPublic(profile?.is_profile_public);
    }
  }, [profile]);

  const handleSave = async () => {
    if (isPublic === profile?.is_profile_public) {
      toast.info("No changes made");
      return;
    }

    try {
      setSaving(true);

      await api.put("/users/me", {
        is_profile_public: isPublic,
      });

      setProfile((prev) => ({
        ...prev,
        is_profile_public: isPublic,
      }));

      toast.success("Settings updated");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      await api.delete("/users/me");
      toast.success("Account deleted successfully");

      logout();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete account");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full">
            <Label
              className="w-full md:w-40 text-md font-medium"
              htmlFor="profile-visibility"
            >
              Make profile public
            </Label>

            <Switch
              id="profile-visibility"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="cursor-pointer"
            />
          </div>

          <div className="w-full flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Login & Security</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full">
            <Label className="w-full md:w-40 text-md font-medium">
              Email Address
            </Label>

            <Input
              disabled
              type="email"
              value={user?.email}
              className="w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full">
            <Label className="w-full md:w-40 text-md font-medium">
              Password
            </Label>

            <div className="w-full flex justify-start">
              <Button
                variant="outline"
                onClick={() => setPasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deleting your account will permanently remove all your blogs and
            data.
          </p>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 ">
          <UpdatePassword closeModal={() => setPasswordModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
