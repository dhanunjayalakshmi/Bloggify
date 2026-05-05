import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const useAuthorBlogs = (username) => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    if (!username || loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await api.get(`/users/${username}/blogs`, {
        params: { page, limit: 5 },
      });

      const newBlogs = res.data.blogs || [];

      setBlogs((prev) => {
        const existingIds = new Set(prev.map((b) => b.id));
        const filtered = newBlogs.filter((b) => !existingIds.has(b.id));
        return [...prev, ...filtered];
      });

      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Failed to fetch author blogs:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, username]);

  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
  }, [username]);

  return { blogs, loading, hasMore, setPage };
};

export default useAuthorBlogs;
