import { useEffect, useRef, useState } from "react";
import BlogCard from "./BlogCard";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Link } from "react-router";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();

  useInfiniteScroll(loaderRef, () => {
    if (hasMore) setPage((prev) => prev + 1);
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch(`/api/blogs?page=${page}&limit=5`);
      const data = await res?.json();
      if (data?.length === 0) setHasMore(false);
      setBlogs((prev) => [...prev, ...data]);
    };
    fetchBlogs();
  }, [page]);

  console.log(blogs);

  return (
    <>
      <div className="space-y-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]?.map((blog) => (
          <Link to={`/blogs/1`}>
            <BlogCard key={blog?.id} blog={blog} />
          </Link>
        ))}
      </div>
      <div ref={loaderRef} className="h-10" />
    </>
  );
};

export default BlogList;
