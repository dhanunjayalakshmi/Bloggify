import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "./BlogCard";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { fetchBlogs } from "@/services/blogService";
import BlogSkeleton from "./BlogSkeleton";

const BlogList = ({
  status = "published",
  mode = "home",
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
  const loaderRef = useRef();

  const seenIds = useRef(new Set());

  useInfiniteScroll(loaderRef, () => {
    if (!loading && hasMore) {
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
      if (!hasMore || loading) return;

      setLoading(true);
      try {
        const res = await fetchBlogs({
          page,
          limit,
          search,
          sort,
          tags: tag,
          authorId,
        });

        const newBlogs = res?.blogs || [];

        const uniqueBlogs = newBlogs?.filter((blog) => {
          if (seenIds?.current?.has(blog.id)) return false;
          seenIds?.current?.add(blog.id);
          return true;
        });

        setBlogs((prev) => [...prev, ...uniqueBlogs]);

        if (res?.totalPages && page >= res?.totalPages) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Blog fetch failed:", err);
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
        {blogs.length === 0 && !loading && (
          <p className="text-center text-muted-foreground">No blogs found.</p>
        )}
        {blogs?.map((blog) => (
          <Link key={blog?.id} to={`/blogs/${blog?.id}`}>
            <BlogCard blog={blog} footerVariant={mode} status={status} />
          </Link>
        ))}
      </div>

      {loading && (
        <div className="space-y-4 mt-4">
          {Array.from({ length: limit }).map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && hasMore && <div ref={loaderRef} className="h-10" />}
    </>
  );
};

export default BlogList;
