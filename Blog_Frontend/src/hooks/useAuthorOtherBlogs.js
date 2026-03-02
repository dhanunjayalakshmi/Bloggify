import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const useAuthorOtherBlogs = (authorId, blogId) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authorId || !blogId) return;

    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/blogs?authorId=${authorId}&exclude=${blogId}&limit=3&sort=newest`,
        );

        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Author other blogs error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [authorId, blogId]);

  return { blogs, loading };
};

export default useAuthorOtherBlogs;
