// src/components/user/posts/PostFilters.jsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const PostFilters = ({ onSearchChange, onSortChange }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchChange(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
      <Input
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:max-w-sm"
      />

      <Select
        value={sort}
        onValueChange={(val) => {
          setSort(val);
          onSortChange(val);
        }}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="views">Most Viewed</SelectItem>
          <SelectItem value="title-asc">Title A–Z</SelectItem>
          <SelectItem value="title-desc">Title Z–A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PostFilters;
