import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const useRelatedBlogs = (tags, blogId) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const tagsKey = JSON.stringify(tags);

  useEffect(() => {
    if (!blogId || !tags?.length) return;

    const fetchRelated = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/blogs?overlapTags=${tags.join(",")}&exclude=${blogId}&limit=3&sort=popular`,
        );
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Related blogs error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [blogId, tagsKey]);

  return { blogs, loading };
};

export default useRelatedBlogs;
