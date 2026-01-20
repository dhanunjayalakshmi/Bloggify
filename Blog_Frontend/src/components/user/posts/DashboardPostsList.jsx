import { useEffect, useState } from "react";
import { fetchMyBlogs } from "@/services/blogService";
import DashboardPostCard from "./DashboardPostCard";

const DashboardPostsList = ({ status, filters }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchMyBlogs({
          status,
          ...filters,
        });

        setPosts(res?.data?.blogs || []);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [status, filters]);

  if (loading) return <p>Loading posts...</p>;

  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  if (!posts?.length)
    return (
      <p className="text-muted-foreground">Not found any {status} posts.</p>
    );

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <DashboardPostCard key={post?.id} post={post} />
      ))}
    </div>
  );
};

export default DashboardPostsList;
