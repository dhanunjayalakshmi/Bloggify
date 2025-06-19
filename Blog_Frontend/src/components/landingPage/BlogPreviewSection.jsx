import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router";

const mockBlogs = [
  {
    title: "How I Built My Blogging Platform with React",
    excerpt: "A step-by-step guide on how I created a Medium-like blog app...",
    author: "Ananya Verma",
    tags: ["React", "Supabase", "Tailwind"],
    date: "June 16, 2025",
  },
  {
    title: "5 Writing Tips to Improve Your Blog Posts",
    excerpt: "Learn how to write engaging content that keeps readers hooked...",
    author: "Raj Patel",
    tags: ["Writing", "Tips"],
    date: "June 15, 2025",
  },
  {
    title: "Exploring AI-Powered Blogging Tools",
    excerpt:
      "From content suggestions to grammar fixes — AI is changing writing.",
    author: "Priya Sharma",
    tags: ["AI", "Productivity"],
    date: "June 14, 2025",
  },
];

const BlogPreviewSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">
        See What Others Are Writing
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {mockBlogs.map((blog, index) => (
          <Card key={index} className="bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg">{blog.title}</CardTitle>
              <CardDescription>{blog.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground">
                By {blog.author} • {blog.date}
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Button onClick={() => navigate("/home")} size="lg">
          Explore All Blogs
        </Button>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
