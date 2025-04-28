import { useState } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const BookmarksContainer = () => {
  const [bookmarks] = useState([
    {
      id: 1,
      title: "Learn React",
      description: "An introduction to React.js",
      author: "John Doe",
      tags: ["react", "frontend"],
      rating: 10,
      cover_image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s",
    },
    {
      id: 2,
      title: "Advanced JS",
      description: "Deep dive into JavaScript",
      author: "Jane Smith",
      tags: ["javascript"],
      rating: 15,
      cover_image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s",
    },
  ]);

  const [sortBy, setSortBy] = useState("recent");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const availableTags = [...new Set(bookmarks.flatMap((b) => b.tags))];

  const filteredBookmarks = bookmarks
    .filter(
      (b) =>
        (selectedTag ? b.tags.includes(selectedTag) : true) &&
        (searchTerm
          ? b.title.toLowerCase().includes(searchTerm.toLowerCase())
          : true)
    )
    .sort((a, b) => {
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });

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

        {availableTags.length > 0 && (
          <Select
            value={selectedTag}
            onValueChange={(val) => setSelectedTag(val)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by Tag" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700">
              <SelectItem value="allTags">All Tags</SelectItem>
              {availableTags.map((tag) => (
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

      {filteredBookmarks.length > 0 ? (
        <div className="space-y-4">
          {filteredBookmarks.map((blog) => (
            <BlogCard key={blog?.id} blog={blog} footerVariant="bookmarks" />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-20">
          You haven’t bookmarked anything yet.
        </div>
      )}
    </div>
  );
};

export default BookmarksContainer;
