import BlogListSection from "./BlogListSection";
import UserProfileHeader from "@/components/user/profile/UserProfileHeader";
import UserProfileStats from "@/components/user/profile/UserProfileStats";
import SocialLinks from "@/components/user/profile/SocialLinks";
import Badges from "@/components/user/profile/Badges";
import JoinedInfo from "@/components/user/profile/JoinedInfo";
import useUserProfile from "@/hooks/useUserProfile";

const AuthorProfilePage = () => {
  const { data: user, error, loading } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (error || !user) return <div>Error loading profile</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-2 py-8">
      <div className="mx-auto px-4 space-y-6 py-8">
        <UserProfileHeader user={user} />
        <UserProfileStats stats={user?.stats} />
        <SocialLinks links={user?.social_links} />
        <Badges badges={user?.badges} />
        <JoinedInfo
          joinDate={user?.account_metadata.join_date}
          lastActive={user?.account_metadata.last_active_at}
        />
      </div>
      <BlogListSection username={user?.username} />
    </div>
  );
};

export default AuthorProfilePage;
