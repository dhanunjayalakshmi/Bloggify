import { useEffect, useState } from "react";
import JoinedInfo from "@/components/user/profile/JoinedInfo";
import SocialLinks from "@/components/user/profile/SocialLinks";
import UserProfileHeader from "@/components/user/profile/UserProfileHeader";
import UserProfileStats from "@/components/user/profile/UserProfileStats";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/apiClient";

const ProfileSkeleton = () => (
  <div className="max-w-4xl min-h-screen mx-auto my-8 px-4 py-8 animate-pulse">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="flex justify-center gap-8 mt-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const UserProfilePage = () => {
  const profile = useAuthStore((store) => store?.profile);
  const setProfile = useAuthStore((store) => store?.setProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.get("/users/me");
        setProfile(res?.data);
      } catch (err) {
        console.error("Failed to refresh profile", err);
      } finally {
        setLoading(false);
      }
    };
    refresh();
  }, []);

  if (loading && !profile) return <ProfileSkeleton />;

  return (
    <div className="max-w-4xl min-h-screen mx-auto my-8">
      <div className="mx-auto px-4 space-y-6 py-8">
        <UserProfileHeader user={profile} isOwnProfile={true} />
        <UserProfileStats stats={profile?.stats} userId={profile?.id} />
        <SocialLinks links={profile?.social_links} />
        <JoinedInfo
          joinDate={profile?.account_metadata?.join_date}
          lastActive={profile?.account_metadata?.last_active_at}
          isCurrentUser={true}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
