import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const useRelatedBlogs = (tags = [], blogId) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  //   console.log(tags);

  useEffect(() => {
    if (!blogId) return;
    if (!tags.length) return;

    const fetchRelated = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/blogs?overlapTags=${tags.join(",")}&exclude=${blogId}&limit=3`,
        );

        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Related blogs error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [blogId, tags]);

  return { blogs, loading };
};

export default useRelatedBlogs;
