import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";
import BlogSkeleton from "./BlogSkeleton";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import api from "@/lib/apiClient";
import { hydrateVotesForContent } from "@/utils/hydrateVotesForContent";
import { useCommentCountStore } from "@/stores/commentCountStore";

const ForYouFeed = ({ limit = 5 }) => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const navigate = useNavigate();
  const seenIds = useRef(new Set());

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  const loaderRef = useInfiniteScroll(() => {
    if (!loadingRef.current && hasMoreRef.current) setPage((prev) => prev + 1);
  });

  useEffect(() => {
    const getBlogs = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await api.get("/blogs/foryou", { params: { page, limit } });
        const data = res.data;

        if (data.empty) {
          setEmpty(true);
          setHasMore(false);
          return;
        }

        const newBlogs = data.blogs || [];
        const uniqueBlogs = newBlogs.filter((blog) => {
          if (seenIds.current.has(blog.id)) return false;
          seenIds.current.add(blog.id);
          return true;
        });

        if (uniqueBlogs.length > 0) {
          const blogIds = uniqueBlogs.map((b) => b.id).join(",");
          const countsRes = await api.get("/comments/counts", { params: { blogIds } });
          useCommentCountStore.getState().setCounts(countsRes.data);
          await hydrateVotesForContent({ contentType: "blog", items: uniqueBlogs });
        }

        setBlogs((prev) => [...prev, ...uniqueBlogs]);
        setHasMore(page < (data.totalPages || 1));
      } catch (err) {
        console.error("ForYouFeed error:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, [page]);

  if (!loading && empty) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">🌱</span>
        <p className="text-muted-foreground font-medium">Your feed is empty</p>
        <p className="text-sm text-muted-foreground">
          Follow some users or tags to see personalized content here
        </p>
        <button
          className="text-sm text-orange-500 hover:underline"
          onClick={() => navigate("/explore/people")}
        >
          Discover people to follow
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onOpen={() => navigate(`/blogs/${blog.id}`)}
          />
        ))}
      </div>

      {loading && (
        <div className="space-y-4 mt-4">
          {Array.from({ length: limit }).map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      )}

      <div ref={loaderRef} className="h-10" />
    </>
  );
};

export default ForYouFeed;
