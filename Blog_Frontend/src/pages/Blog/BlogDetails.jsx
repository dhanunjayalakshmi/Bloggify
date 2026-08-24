import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Bookmark, MessageCircle, Share2, Link as LinkIcon } from "lucide-react";
import BlogContentRenderer from "@/components/blogEditor/BlogContentRenderer";
import ContentVotes from "@/components/blogs/ContentVotes";
import BlogComments from "@/components/blogs/BlogComments";
import ReadingProgressBar from "@/components/blogs/ReadingProgressBar";
import TableOfContents from "@/components/blogs/TableOfContents";
import useTableOfContents from "@/hooks/useTableOfContents";
import useBookmark from "@/hooks/useBookmark";
import { hydrateVotesForContent } from "@/utils/hydrateVotesForContent";
import useRelatedBlogs from "@/hooks/useRelatedBlogs";
import MiniBlogList from "@/components/blogs/MiniBlogList";
import useAuthorOtherBlogs from "@/hooks/useAuthorOtherBlogs";
import FollowButton from "@/components/user/profile/FollowButton";
import BlogReactions from "@/components/blogs/BlogReactions";
import TagFollowButton from "@/components/TagFollowButton";
import SeriesWidget from "@/components/blogs/SeriesWidget";
import useProfileNavigation from "@/hooks/useProfileNavigation";
import { parseUTC } from "@/utils/parseUTC";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const BlogDetails = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentUserId = useAuthStore((state) => state?.profile?.id);
  const { isBookmarked, toggle } = useBookmark(blogId);
  const commentsRef = useRef(null);

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShareOption = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(blog?.title || "");

    const destinations = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
      return;
    }

    window.open(destinations[platform], "_blank", "noopener,noreferrer");
  };

  const { blogs: relatedBlogs } = useRelatedBlogs(blog?.tags, blogId);
  const { headings, activeId } = useTableOfContents(blog?.content, "blog-content");
  const authorId = blog?.users?.id;
  const { blogs: authorBlogs } = useAuthorOtherBlogs(authorId, blogId);

  const goToProfile = useProfileNavigation();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const [blogRes, commentsCountRes] = await Promise.all([
          api.get(`/blogs/${blogId}`),
          api.get(`/comments/counts`, {
            params: { blogIds: blogId },
          }),
        ]);

        setBlog(blogRes?.data);
        setCommentsCount(commentsCountRes?.data?.[0]?.count || 0);
      } catch (err) {
        console.error("BlogDetails error:", {
          message: err?.message,
          response: err?.response?.data,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  useEffect(() => {
    if (!blog) return;

    hydrateVotesForContent({ contentType: "blog", items: [blog] });
  }, [blog]);

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-8 my-8 rounded-lg dark:bg-gray-800 bg-white animate-pulse">
        <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        <div className="flex items-center gap-3 mt-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mt-6 mb-8" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${i % 3 === 2 ? "w-2/3" : "w-full"}`}
            />
          ))}
        </div>
      </div>
    );
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
    <>
    <ReadingProgressBar />
    <div className="max-w-6xl mx-auto my-8 px-4 flex gap-8 items-start">
    <div className="flex-1 min-w-0 p-8 rounded-lg dark:bg-gray-800 bg-white text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold leading-tight tracking-tight mb-4">
        {title}
      </h1>

      <div className="flex flex-wrap items-center mt-6 gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-10 w-10 cursor-pointer"
            onClick={() => goToProfile(users?.id)}
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
              onClick={() => goToProfile(users?.id)}
            >
              {users?.name || "Unknown Author"}
            </span>
            <span className="text-xs">
              {parseUTC(published_at)?.toLocaleDateString()} • {read_time} min
              read
            </span>
          </div>
        </div>
        {currentUserId !== users?.id && <FollowButton userId={users?.id} />}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <ContentVotes
          contentId={blog?.id}
          contentType="blog"
          className="ml-2"
          disabled={currentUserId === blog?.user_id}
        />

        <Button variant="ghostButton" aria-label="Comment" onClick={scrollToComments}>
          <MessageCircle className="h-5 w-5" />
          <span>{commentsCount}</span>
        </Button>

        <Button variant="ghostButton" aria-label="Views">
          <span>🔥 {blog?.views} views</span>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghostButton"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-gray-900 w-44">
            <DropdownMenuItem
              onClick={() => handleShareOption("twitter")}
              className="gap-2 dark:hover:bg-gray-800 cursor-pointer"
            >
              <span className="font-bold text-sm w-4 text-center">𝕏</span> Share on X
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleShareOption("linkedin")}
              className="gap-2 dark:hover:bg-gray-800 cursor-pointer"
            >
              <span className="font-bold text-sm w-4 text-center text-blue-600">in</span> Share on LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleShareOption("whatsapp")}
              className="gap-2 dark:hover:bg-gray-800 cursor-pointer"
            >
              💬 Share on WhatsApp
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleShareOption("copy")}
              className="gap-2 dark:hover:bg-gray-800 cursor-pointer"
            >
              <LinkIcon className="h-4 w-4" /> Copy link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        <BlogContentRenderer content={content} id="blog-content" />
      </div>

      <SeriesWidget blogId={blogId} />

      {tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <TagFollowButton key={idx} tag={tag} />
          ))}
        </div>
      )}

      <BlogReactions blogId={blogId} />

      <div ref={commentsRef}>
        <BlogComments blogId={blogId} blogAuthorId={blog?.user_id} />
      </div>

      {/* Other Articles from Author */}
      <div className="mt-10">
        <MiniBlogList
          title={`More from ${users?.name || "this author"}`}
          blogs={authorBlogs}
          seeMorePath={users?.id ? `/users/${users?.id}` : null}
        />
      </div>

      {/* Other Platform Suggestions */}

      <div className="mt-6">
        <MiniBlogList
          title="Related Articles"
          blogs={relatedBlogs}
          seeMorePath={tags?.[0] ? `/tags/${tags[0]}` : null}
        />
      </div>
    </div>

    {/* TOC sidebar — visible only on xl screens */}
    <aside className="hidden xl:block w-52 flex-shrink-0">
      <TableOfContents headings={headings} activeId={activeId} />
    </aside>

    </div>
    </>
  );
};

export default BlogDetails;
