// import Badges from "@/components/user/profile/Badges";
import JoinedInfo from "@/components/user/profile/JoinedInfo";
import SocialLinks from "@/components/user/profile/SocialLinks";
import UserProfileHeader from "@/components/user/profile/UserProfileHeader";
import UserProfileStats from "@/components/user/profile/UserProfileStats";
import useUserProfile from "@/hooks/useUserProfile";
import { useAuthStore } from "@/stores/authStore";

const UserProfilePage = () => {
  const { error, loading } = useUserProfile();
  const user = useAuthStore((store) => store?.profile);

  if (loading) return <div>Loading...</div>;
  if (error || !user) return <div>Error loading profile</div>;

  return (
    <div className="max-w-4xl min-h-screen mx-auto my-8">
      <div className="mx-auto px-4 space-y-6 py-8">
        <UserProfileHeader user={user} isOwnProfile={true} />
        <UserProfileStats stats={user?.stats} />
        <SocialLinks links={user?.social_links} />
        {/* <Badges badges={user?.badges} /> */}
        <JoinedInfo
          joinDate={user?.account_metadata?.join_date}
          lastActive={user?.account_metadata?.last_active_at}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
