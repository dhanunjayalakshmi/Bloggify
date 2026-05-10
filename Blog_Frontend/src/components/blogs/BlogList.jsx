import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { fetchBlogs } from "@/services/blogService";
import BlogSkeleton from "./BlogSkeleton";
import { hydrateVotesForContent } from "@/utils/hydrateVotesForContent";
import { useCommentCountStore } from "@/stores/commentCountStore";
import api from "@/lib/apiClient";

const BlogList = ({
  search = "",
  limit = 5,
  sort = "newest",
  tag = "All Tags",
  authorId = null,
}) => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const seenIds = useRef(new Set());

  // Refs so the intersection callback always reads current values — no stale closures
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  const loaderRef = useInfiniteScroll(() => {
    if (!loadingRef.current && hasMoreRef.current) {
      setPage((prev) => prev + 1);
    }
  });

  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
    seenIds.current = new Set();
  }, [search, sort, tag, authorId]);

  useEffect(() => {
    const getBlogs = async () => {
      if (loading) return;

      setLoading(true);
      try {
        const blogsRes = await fetchBlogs({
          page,
          limit,
          search,
          sort,
          tags: tag,
          authorId,
        });

        if (!blogsRes) return;

        const newBlogs = blogsRes?.blogs || [];

        const uniqueBlogs = newBlogs?.filter((blog) => {
          if (seenIds?.current?.has(blog?.id)) return false;
          seenIds?.current?.add(blog?.id);
          return true;
        });

        if (uniqueBlogs?.length > 0) {
          const blogIds = uniqueBlogs?.map((blog) => blog?.id)?.join(",");

          const res = await api?.get("/comments/counts", {
            params: { blogIds },
          });

          useCommentCountStore.getState().setCounts(res.data);

          await hydrateVotesForContent({
            contentType: "blog",
            items: uniqueBlogs,
          });
        }

        setBlogs((prev) => [...prev, ...uniqueBlogs]);

        const totalPages = blogsRes?.totalPages || 1;
        setHasMore(page < totalPages);
      } catch (err) {
        console.error("BlogList error:", {
          message: err?.message,
          response: err?.response?.data,
        });
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, [page, search, sort, tag, authorId]);

  return (
    <>
      <div className="space-y-4">
        {blogs?.length === 0 && !loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl">📭</span>
            <p className="text-muted-foreground font-medium">
              {search
                ? `No results for "${search}"`
                : tag && tag !== "All Tags"
                  ? `No blogs tagged with #${tag} yet`
                  : authorId
                    ? "This author hasn't published anything yet"
                    : "No blogs here yet"}
            </p>
            {!search && !authorId && (
              <button
                className="text-sm text-orange-500 hover:underline"
                onClick={() => navigate("/create")}
              >
                Be the first to write something
              </button>
            )}
            {search && (
              <button
                className="text-sm text-orange-500 hover:underline"
                onClick={() => navigate("/home")}
              >
                Back to home feed
              </button>
            )}
          </div>
        )}
        {blogs?.map((blog) => (
          <BlogCard
            key={blog?.id}
            blog={blog}
            onOpen={() => navigate(`/blogs/${blog?.id}`)}
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

      {/* Always rendered so the observer isn't recreated on every hasMore/loading change.
          Intersection only fires when the user genuinely scrolls to this element. */}
      <div ref={loaderRef} className="h-10" />
    </>
  );
};

export default BlogList;
