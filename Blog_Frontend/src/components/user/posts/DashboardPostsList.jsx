import DashboardPostCard from "./DashboardPostCard";
import { useNavigate } from "react-router";

const DashboardPostsList = ({ posts, loading, error }) => {
  const navigate = useNavigate();

  if (loading && !posts.length) return <p>Loading posts...</p>;

  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  if (!posts?.length)
    return <div className="dark:text-white text-lg">Not found any posts.</div>;

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <DashboardPostCard
          key={post?.id}
          post={post}
          stats={{
            views: post?.views,
            comments: post?.comments,
            upvotes: post?.upvotes,
          }}
          onOpen={() => navigate(`/dashboard/posts/${post?.id}`)}
        />
      ))}
    </div>
  );
};

export default DashboardPostsList;
