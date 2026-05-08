import BlogListSection from "./BlogListSection";
import UserProfileHeader from "@/components/user/profile/UserProfileHeader";
import UserProfileStats from "@/components/user/profile/UserProfileStats";
import SocialLinks from "@/components/user/profile/SocialLinks";
import Badges from "@/components/user/profile/Badges";
import JoinedInfo from "@/components/user/profile/JoinedInfo";
import useUserProfile from "@/hooks/useUserProfile";
import { useParams } from "react-router";
const AuthorProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="flex justify-center gap-8 mt-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
    <div className="mt-8 space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      ))}
    </div>
  </div>
);

const AuthorProfilePage = () => {
  const { data: author, error, loading } = useUserProfile();
  const { userId } = useParams();

  if (loading) return <AuthorProfileSkeleton />;
  if (author?.message)
    return (
      <div className="max-w-4xl mx-auto px-4 space-y-6 py-8">
        Profile is Private
      </div>
    );

  if (error || !author)
    return (
      <div className="max-w-4xl mx-auto px-4 space-y-2 py-8">
        Error Loading Profile
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-2 py-8">
      <div className="mx-auto px-4 space-y-6 py-8">
        <UserProfileHeader user={author} userId={userId} />
        <UserProfileStats stats={author?.stats} userId={userId} />
        <SocialLinks links={author?.social_links} />
        <Badges badges={author?.badges} />
        <JoinedInfo
          joinDate={author?.account_metadata?.join_date}
          lastActive={author?.account_metadata?.last_active_at}
        />
      </div>
      <BlogListSection authorUserName={author?.username} />
    </div>
  );
};

export default AuthorProfilePage;
