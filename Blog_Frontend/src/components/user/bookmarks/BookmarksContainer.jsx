import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router";

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

const BookmarksContainer = () => {
  const { bookmarkList, loading, fetchBookmarkedBlogs } = useBookmarkStore();

  const [sortBy, setSortBy] = useState("recent");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const availableTags = [...new Set(bookmarkList?.flatMap((b) => b.tags))];

  const filteredBookmarks = bookmarkList
    ?.filter(
      (b) =>
        (selectedTag ? b?.tags?.includes(selectedTag) : true) &&
        (searchTerm
          ? b?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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

  if (loading) {
    return <div className="py-20 text-center">Loading bookmarks...</div>;
  }

  if (!bookmarkList?.length) {
    return (
      <div className="text-center text-muted-foreground py-20">
        You haven’t bookmarked anything yet.
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

      {filteredBookmarks?.map((blog) => (
        <BookmarkCardItem key={blog?.id} blog={blog} />
      ))}
    </div>
  );
};

export default BookmarksContainer;
