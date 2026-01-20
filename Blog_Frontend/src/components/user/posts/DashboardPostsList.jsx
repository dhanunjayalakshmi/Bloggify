import { useEffect, useState } from "react";
import DashboardPostCard from "./DashboardPostCard";
import { fetchMyBlogs } from "@/services/dashboardService";

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
      <div className="dark:text-white text-lg">
        Not found any {status} posts.
      </div>
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
