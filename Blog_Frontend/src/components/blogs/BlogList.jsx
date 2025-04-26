import { useEffect, useRef, useState } from "react";
import BlogCard from "./BlogCard";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Link } from "react-router";

const BlogList = ({
  status = "published",
  mode = "home",
  search = "",
  sort = "recent",
  tag = "All Tags",
  date = {},
}) => {
  const [blogs, setBlogs] = useState([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
  ]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();

  useInfiniteScroll(loaderRef, () => {
    if (hasMore) setPage((prev) => prev + 1);
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      const queryParams = new URLSearchParams({
        status,
        page,
        limit: 5,
        search,
        sort,
        tag,
        from: date.from || "",
        to: date.to || "",
      });

      const res = await fetch(`/api/blogs?${queryParams}`);
      const data = await res?.json();
      if (data?.length === 0) setHasMore(false);
      setBlogs((prev) => [...prev, ...data]);
    };
    fetchBlogs();
  }, [page, status, search, sort, tag, date]);

  return (
    <>
      <div className="space-y-4">
        {blogs?.map((blog) => (
          <Link key={blog} to={`/blogs/${blog}`}>
            <BlogCard blog={blog} mode={mode} status={status} />
          </Link>
        ))}
      </div>
      <div ref={loaderRef} className="h-10" />
    </>
  );
};

export default BlogList;
