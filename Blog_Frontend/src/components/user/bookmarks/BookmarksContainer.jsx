import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BlogCard from "@/components/blogs/BlogCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useBookmark from "@/hooks/useBookmark";
import { useBookmarkStore } from "@/stores/bookmarksStore";

const BookmarkCardItem = ({ blog }) => {
  const { isBookmarked, toggle } = useBookmark(blog?.id);
  const navigate = useNavigate();

  return (
    <BlogCard
      blog={{ ...blog, isBookmarked }}
      onBookmarkToggle={toggle}
      onOpen={() => navigate(`/blogs/${blog?.id}`)}
    />
  );
};

const formatTag = (tag) => {
  const normalized = String(tag || "")
    .trim()
    .replace(/^#/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();

  return normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : "";
};

const BookmarksSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex gap-4">
      <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    ))}
  </div>
);

const BookmarksContainer = () => {
  const navigate = useNavigate();
  const { bookmarkList, loading, fetchBookmarkedBlogs } = useBookmarkStore();

  const [sortBy, setSortBy] = useState("recent");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const availableTags = [
    ...new Set(bookmarkList?.flatMap((blog) => blog?.tags?.map(formatTag))),
  ].sort();

  const filteredBookmarks = bookmarkList
    ?.filter(
      (blog) =>
        (selectedTag
          ? blog?.tags?.some((tag) => formatTag(tag) === selectedTag)
          : true) &&
        (searchTerm
          ? blog?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase())
          : true),
    )
    ?.sort((a, b) => {
      if (sortBy === "author") return a?.author?.localeCompare(b?.author);
      if (sortBy === "alphabetical") return a?.title?.localeCompare(b?.title);
      return 0;
    });

  useEffect(() => {
    fetchBookmarkedBlogs();
  }, [fetchBookmarkedBlogs]);

  if (loading) return <BookmarksSkeleton />;

  if (!bookmarkList?.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <span className="text-4xl">🔖</span>
        <p className="text-muted-foreground font-medium">
          You haven’t bookmarked anything yet
        </p>
        <button
          className="text-sm text-orange-500 hover:underline"
          onClick={() => navigate("/home")}
        >
          Explore blogs to save
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />

        <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700">
            <SelectItem value="recent">Recently Saved</SelectItem>
            <SelectItem value="author">By Author</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>

        {availableTags?.length > 0 && (
          <Select
            value={selectedTag || "__all__"}
            onValueChange={(val) =>
              setSelectedTag(val === "__all__" ? "" : val)
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by Tag" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700">
              <SelectItem value="__all__">All Tags</SelectItem>
              {availableTags?.map((tag) => (
                <SelectItem
                  key={tag}
                  value={tag}
                  className={`hover:dark:bg-gray-800 ${
                    tag === selectedTag ? "dark:bg-gray-800" : ""
                  }`}
                >
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {filteredBookmarks?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <span className="text-3xl">🔍</span>
          <p className="text-muted-foreground font-medium">
            No bookmarks match your search or filter
          </p>
        </div>
      )}

      {filteredBookmarks?.map((blog) => (
        <BookmarkCardItem key={blog?.id} blog={blog} />
      ))}
    </div>
  );
};

export default BookmarksContainer;
