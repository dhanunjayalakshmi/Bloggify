import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BlogCard = ({ blog, user }) => {
  const { title, content, cover_image, published_at } = blog;
  return (
    <Card className="shadow-card dark:bg-gray-800 cursor-pointer">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-center gap-3 mb-4 ">
          <img
            src={
              cover_image ||
              "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
            }
            alt="No Image"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-sm line-clamp-3">
              {content?.replace(/<[^>]*>/g, "").substring(0, 150) ||
                "Welcome to my blog"}
            </p>

            <p className="text-muted-foreground text-xs mt-2">
              {user} - {new Date(published_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
