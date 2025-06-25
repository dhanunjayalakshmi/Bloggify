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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();

  const mockBlog = {
    id: 1,
    cover_image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s",
    title: "My first blog",
    description: "Welcome to my first blog",
    author: "Dhanunjaya",
    tags: ["first", "blog"],
    rating: 20,
    views: 123,
    lastEdited: "2025-04-19",
    scheduledFor: "2025-04-25",
  };

  const [blogs, setBlogs] = useState(
    Array.from({ length: 10 }, (_, i) => ({ ...mockBlog, id: i + 1 }))
  );

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

      console.log(queryParams);

      // const res = await fetch(`/api/blogs?${queryParams}`);
      // if (!res.ok) {
      //   console.error("API failed!", res.status);
      //   setHasMore(false);
      //   return;
      // }
      // const data = await res?.json();
      // if (data?.length === 0) setHasMore(false);
      if (blogs?.length === 25) {
        setHasMore(false);
      } else {
        const newMocks = Array.from({ length: 5 }, (_, i) => ({
          ...mockBlog,
          id: blogs.length + i + 1,
        }));
        setBlogs((prev) => [...prev, ...newMocks]);
      }
    };
    fetchBlogs();
  }, [page, status, search, sort, tag, date]);

  return (
    <>
      <div className="space-y-4">
        {blogs?.map((blog) => (
          <Link key={blog.id} to={`/blogs/${blog.id}`}>
            <BlogCard blog={blog} footerVariant={mode} status={status} />
          </Link>
        ))}
      </div>
      <div ref={loaderRef} className="h-10" />
    </>
  );
};

export default BlogList;
