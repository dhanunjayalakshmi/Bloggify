import { useEffect, useRef, useState } from "react";
import BlogCard from "./BlogCard";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Link } from "react-router";

const BlogList = ({
  status = "published",
  mode = "home",
  search = "",
  sort = "newest",
  tag = "All Tags",
  //   date = {},
  authorId = null,
}) => {
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();

  useInfiniteScroll(loaderRef, () => {
    if (hasMore) setPage((prev) => prev + 1);
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const params = new URLSearchParams({
          page,
          limit: 5,
          sort,
          ...(search && { search }),
          ...(authorId && { authorId }),
          ...(tag && tag !== "All Tags" && { tags: tag }),
        });

        const res = await fetch(`/api/blogs?${params}`);
        const json = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch blogs:", json?.error);
          return;
        }

        const newBlogs = json?.blogs || [];

        if (newBlogs.length === 0 || page >= json?.totalPages) {
          setHasMore(false);
        }

        setBlogs((prev) => [...prev, ...newBlogs]);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setHasMore(false);
      }
    };

    fetchBlogs();
  }, [page, search, sort, tag, authorId]);

  return (
    <>
      <div className="space-y-4">
        {blogs?.map((blog) => (
          <Link key={blog?.id} to={`/blogs/${blog?.id}`}>
            <BlogCard blog={blog} footerVariant={mode} status={status} />
          </Link>
        ))}
      </div>
      {hasMore && <div ref={loaderRef} className="h-10" />}
    </>
  );
};

export default BlogList;
