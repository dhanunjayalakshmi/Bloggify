import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Bookmark,
  MessageCircle,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import BlogContentRenderer from "@/components/blogEditor/BlogContentRenderer";
// import BlogVotes from "@/components/blogs/BlogVotes";
import BlogComments from "@/components/blogs/BlogComments";

const BlogDetails = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${blogId}`);
        setBlog(res?.data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!blog) return <div className="p-4">Blog not found.</div>;

  const {
    title,
    content,
    tags,
    published_at,
    read_time,
    users,
    cover_image: coverImageUrl,
  } = blog;

  return (
    <div className="max-w-4xl mx-auto p-8 my-8 rounded-lg dark:bg-gray-800 bg-white text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold leading-tight tracking-tight mb-4">
        {title}
      </h1>

      <div className="flex flex-wrap items-center mt-6 gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-10 w-10 cursor-pointer"
            onClick={() => navigate(`/user/${users?.id || 1}`)}
          >
            <AvatarImage
              className="w-10 h-10 rounded-full object-cover"
              src={
                users?.avatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
              }
            />
          </Avatar>
          <div className="flex flex-col">
            <span
              className="font-medium cursor-pointer"
              onClick={() => navigate(`/user/${users?.id || 1}`)}
            >
              {users?.name || "Unknown Author"}
            </span>
            <span className="text-xs">
              {new Date(published_at).toLocaleDateString()} • {read_time} min
              read
            </span>
          </div>
        </div>
        <Button size="sm">Follow</Button>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button variant="ghostButton" aria-label="Like">
          <ThumbsUp className="h-5 w-5" />
          <span>120</span>
        </Button>
        <Button variant="ghostButton" aria-label="Comment">
          <MessageCircle className="h-5 w-5" />
          <span>56</span>
        </Button>
        <Button size="icon" variant="ghostButton" aria-label="Bookmark">
          <Bookmark className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghostButton" aria-label="Share">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {coverImageUrl && (
        <div className="mt-6 mb-8">
          <img
            src={coverImageUrl}
            alt="Cover"
            className="w-full max-h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert tiptap max-w-none mt-6 space-y-2">
        <BlogContentRenderer content={content} />
      </div>

      {tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-block bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* <BlogVotes blogId={blogId} /> */}

      {/* Comments Section */}
      {/* <div className="mt-10 space-y-4">
        <h3 className="text-lg font-semibold">Comments (23)</h3>

        <div className="flex gap-3 items-start">
          <Avatar>
            <AvatarImage
              className="w-8 h-8 rounded-full object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
            />
          </Avatar>
          <div className="space-y-1">
            <p className="font-medium">
              John Doe{" "}
              <span className="text-sm text-muted-foreground">
                • October 12, 2023
              </span>
            </p>
            <p>This article is very insightful and well-written!</p>
            <div className="flex gap-4 mt-2">
              <Button variant="outline" size="icon">
                <ThumbsUp size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <ThumbsDown size={16} />
              </Button>
              <Button variant="outline" className="text-blue-600">
                Reply
              </Button>
            </div>
          </div>
        </div>

        {/* Add your other comments here */}
      <Button className="mt-4 mx-auto block w-1/2 max-w-xs">
        See all comments
      </Button>
      {/* </div> */}
      <BlogComments blogId={blogId} />

      {/* Other Articles from Author */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold">
          Other Suggested Articles from Author
        </h3>
        <div className="grid gap-4 mt-4">
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-xl shadow-sm transition hover:shadow-md hover:bg-muted dark:hover:bg-gray-800 cursor-pointer"
            >
              <h4 className="font-semibold">Blog Title</h4>
              <p className="text-sm text-muted-foreground">
                A brief description of the blog post content goes here.
              </p>
            </div>
          ))}
        </div>
        <Button className="mt-4">See More</Button>
      </div>

      {/* Other Platform Suggestions */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold">
          Other Suggestions from Platform
        </h3>
        <div className="grid gap-4 mt-4">
          {[1, 2].map((_, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-xl shadow-sm transition hover:shadow-md hover:bg-muted dark:hover:bg-gray-800 cursor-pointer"
            >
              <h4 className="font-semibold">Blog Title</h4>
              <p className="text-sm text-muted-foreground">
                A brief description of the blog post content goes here.
              </p>
            </div>
          ))}
        </div>
        <Button className="mt-4">See More</Button>
      </div>
    </div>
  );
};

export default BlogDetails;
