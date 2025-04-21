import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BlogCard = ({ blog }) => {
  const { title, description, author, date, altName } = blog;
  return (
    <Card className="shadow-card dark:bg-gray-800 cursor-pointer">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-center gap-3 mb-4 ">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
            alt={altName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-sm">
            <p className="font-normal">{description}</p>
            <p className="text-muted-foreground text-xs">
              {author} - {date}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
