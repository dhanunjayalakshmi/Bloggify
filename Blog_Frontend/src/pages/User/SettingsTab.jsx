import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabaseClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import UpdatePassword from "../Auth/UpdatePassword";

const SettingsPage = () => {
  const { user, profile, logout, setProfile } = useAuthStore();

  const [isPublic, setIsPublic] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [identities, setIdentities] = useState([]);
  const [unlinking, setUnlinking] = useState(null);
  const [pendingIdentity, setPendingIdentity] = useState(null);
  const [setPasswordOpen, setSetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingPassword, setSettingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsPublic(profile?.is_profile_public);
    }
  }, [profile]);

  useEffect(() => {
    supabase.auth.getUserIdentities().then(({ data, error }) => {
      if (!error && data?.identities) {
        setIdentities(data.identities);
      }
    });
  }, []);

  const doUnlink = async (identity) => {
    setUnlinking(identity.id);
    const { error } = await supabase.auth.unlinkIdentity(identity);
    if (error) {
      toast.error(error.message || "Failed to unlink provider");
    } else {
      setIdentities((prev) => prev.filter((i) => i.id !== identity.id));
      toast.success(`${identity.provider.charAt(0).toUpperCase() + identity.provider.slice(1)} account removed`);
    }
    setUnlinking(null);
  };

  const handleUnlink = (identity) => {
    const hasEmail = identities.some((i) => i.provider === "email");
    const oauthCount = identities.filter((i) => i.provider !== "email").length;

    if (!hasEmail && oauthCount <= 1) {
      setPendingIdentity(identity);
      setSetPasswordOpen(true);
      return;
    }

    doUnlink(identity);
  };

  const handleSetPasswordAndUnlink = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setSettingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message || "Failed to set password");
      setSettingPassword(false);
      return;
    }

    await doUnlink(pendingIdentity);

    // Refresh identities so email now appears
    const { data } = await supabase.auth.getUserIdentities();
    if (data?.identities) setIdentities(data.identities);

    setSetPasswordOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    setPendingIdentity(null);
    setSettingPassword(false);
  };

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

          {identities.filter((i) => i.provider !== "email").length > 0 && (
            <div className="flex flex-col gap-3">
              <Label className="text-md font-medium">Connected Accounts</Label>
              {identities
                .filter((i) => i.provider !== "email")
                .map((identity) => (
                  <div
                    key={identity.id}
                    className="flex items-center justify-between rounded-lg border dark:border-gray-700 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {identity.provider === "google" && (
                        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                          <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                        </svg>
                      )}
                      {identity.provider === "github" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                      )}
                      <span className="text-sm font-medium capitalize">
                        {identity.provider}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {identity.identity_data?.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950"
                      disabled={unlinking === identity.id}
                      onClick={() => handleUnlink(identity)}
                    >
                      {unlinking === identity.id ? "Removing..." : "Remove"}
                    </Button>
                  </div>
                ))}
            </div>
          )}
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
            onClick={() => setDeleteOpen(true)}
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

      <Dialog open={setPasswordOpen} onOpenChange={setSetPasswordOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 max-w-md">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Set a password first</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You're about to remove your only login method (
                <span className="font-medium capitalize">{pendingIdentity?.provider}</span>
                ). Set a password so you can still sign in with your email{" "}
                <span className="font-medium">{user?.email}</span>.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="dark:bg-gray-700"
                />
              </div>
              <div className="space-y-1">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSetPasswordOpen(false);
                  setNewPassword("");
                  setConfirmPassword("");
                  setPendingIdentity(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleSetPasswordAndUnlink}
                disabled={settingPassword}
              >
                {settingPassword ? "Saving..." : `Set Password & Remove ${pendingIdentity?.provider}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all your blogs. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;
