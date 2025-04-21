import React from "react";
import EmptyStateFallback from "@/components/EmptyStateFallback";
import BlogCard from "./BlogCard";

const BlogListSection = () => {
  const blogs = {
    title: "Mini Blog Title",
    description: "This is small description about the blog",
    author: "Author",
    date: "Date",
    altName: "bookmarks",
  };

  if (blogs.length === 0) {
    return <EmptyStateFallback />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8]?.map((index) => (
        <BlogCard key={index} blog={blogs} />
      ))}
    </div>
  );
};

export default BlogListSection;
