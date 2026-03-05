import React, { useEffect, useRef } from "react";
import EmptyStateFallback from "@/components/EmptyStateFallback";
import BlogCard from "./BlogCard";
import useAuthorBlogs from "@/hooks/useAuthorBlogs";
import { useNavigate } from "react-router";

const BlogListSection = ({ authorUserName }) => {
  const { blogs, loading, hasMore, setPage } = useAuthorBlogs(authorUserName);

  const observerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );

    const currentRef = observerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, loading]);

  if (blogs.length === 0 && !loading) {
    return <EmptyStateFallback />;
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-6">Published Posts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs?.map((blog) => (
          <BlogCard
            key={blog?.id}
            blog={blog}
            user={authorUserName}
            onOpen={() => navigate(`/blogs/${blog?.id}`)}
          />
        ))}
      </div>

      {loading && (
        <p className="text-center py-4 text-muted-foreground">Loading...</p>
      )}

      {hasMore && <div ref={observerRef} className="h-10" />}
    </div>
  );
};

export default BlogListSection;
