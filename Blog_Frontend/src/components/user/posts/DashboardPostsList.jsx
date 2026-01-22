import { useEffect, useState } from "react";
import DashboardPostCard from "./DashboardPostCard";
import { fetchBlogStats } from "@/services/dashboardService";

const DashboardPostsList = ({ posts, loading, error }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      if (!posts?.length) return;

      const blogIds = posts?.map((post) => post?.id);

      try {
        const res = await fetchBlogStats({ blogIds });
        setStats(res?.data);
      } catch (err) {
        console.error("Dashboard stats error", err);
      }
    };

    fetchStats();
  }, [posts]);

  if (loading && !posts.length) return <p>Loading posts...</p>;

  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  if (!posts?.length)
    return <div className="dark:text-white text-lg">Not found any posts.</div>;

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <DashboardPostCard key={post?.id} post={post} stats={stats[post?.id]} />
      ))}
    </div>
  );
};

export default DashboardPostsList;
