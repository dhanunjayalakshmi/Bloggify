import BlogListSection from "./BlogListSection";
import UserProfileHeader from "@/components/user/profile/UserProfileHeader";
import UserProfileStats from "@/components/user/profile/UserProfileStats";
import SocialLinks from "@/components/user/profile/SocialLinks";
import Badges from "@/components/user/profile/Badges";
import JoinedInfo from "@/components/user/profile/JoinedInfo";
import useUserProfile from "@/hooks/useUserProfile";
import { useParams } from "react-router";

const AuthorProfilePage = () => {
  const { data: author, error, loading } = useUserProfile();
  const { userId } = useParams();

  if (loading) return <div>Loading...</div>;
  if (error || !author) return <div>Error loading profile</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-2 py-8">
      <div className="mx-auto px-4 space-y-6 py-8">
        <UserProfileHeader user={author} userId={userId} />
        <UserProfileStats stats={author?.stats} userId={userId} />
        <SocialLinks links={author?.social_links} />
        <Badges badges={author?.badges} />
        <JoinedInfo
          joinDate={author?.account_metadata.join_date}
          lastActive={author?.account_metadata.last_active_at}
        />
      </div>
      <BlogListSection authorUserName={author?.username} />
    </div>
  );
};

export default AuthorProfilePage;
