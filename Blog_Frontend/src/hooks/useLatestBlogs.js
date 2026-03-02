import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const useLatestBlogs = (limit = 5) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs?limit=${limit}&sort=newest`);
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Sidebar latest blogs error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [limit]);

  return { blogs, loading };
};

export default useLatestBlogs;
