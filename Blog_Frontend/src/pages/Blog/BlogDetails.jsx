import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Bookmark, MessageCircle, Share2 } from "lucide-react";
import BlogContentRenderer from "@/components/blogEditor/BlogContentRenderer";
import ContentVotes from "@/components/blogs/ContentVotes";
import BlogComments from "@/components/blogs/BlogComments";
import useBookmark from "@/hooks/useBookmark";
import { useVoteStore } from "@/stores/votesStore";
import { voteService } from "@/services/voteService";

const BlogDetails = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isBookmarked, toggle } = useBookmark(blogId);

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

  useEffect(() => {
    if (!blogId) return;

    const hydrate = async () => {
      const key = `blog:${blogId}`;
      const existing = useVoteStore.getState().votesByContent[key];

      if (existing) return;

      const res = await voteService.getVoteCounts({
        contentType: "blog",
        ids: [blogId],
      });

      useVoteStore.getState().setVoteCounts("blog", res?.data);
    };

    hydrate();
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
        <ContentVotes
          contentId={blog?.id}
          contentType="blog"
          className="ml-2"
        />

        <Button variant="ghostButton" aria-label="Comment">
          <MessageCircle className="h-5 w-5" />
          <span>56</span>
        </Button>

        <Button
          size="icon"
          variant="ghostButton"
          aria-label="Bookmark"
          onClick={toggle}
          className="transition-transform transform hover:scale-110 active:scale-90"
        >
          <Bookmark
            size={18}
            className={`${
              isBookmarked ? "fill-black dark:fill-white" : "fill-none"
            } stroke-current`}
          />
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
