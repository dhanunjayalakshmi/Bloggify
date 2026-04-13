import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const PostsFilters = ({ filters, onChange, sortOptions, tags }) => {
  const [localSearch, setLocalSearch] = useState(filters?.search);

  useEffect(() => {
    setLocalSearch(filters?.search || "");
  }, [filters?.search]);

  useEffect(() => {
    const id = setTimeout(() => {
      onChange({ search: localSearch });
    }, 300);
    return () => clearTimeout(id);
  }, [localSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Search by title..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="sm:max-w-sm"
      />

      <Select
        value={filters?.sort}
        onValueChange={(val) => onChange({ sort: val })}
      >
        <SelectTrigger className="sm:w-40 cursor-pointer">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-700 cursor-pointer">
          {sortOptions?.map((opt) => (
            <SelectItem
              key={opt?.value}
              value={opt?.value}
              className={`hover:dark:bg-gray-800 cursor-pointer ${
                opt?.value === filters?.sort ? "dark:bg-gray-800" : ""
              }`}
            >
              {opt?.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.tag}
        onValueChange={(val) => onChange({ tag: val })}
      >
        <SelectTrigger className="sm:w-40 cursor-pointer">
          <SelectValue placeholder="Filter by tag" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-700 cursor-pointer">
          {tags?.map((tag) => (
            <SelectItem
              key={tag}
              value={tag}
              className={`hover:dark:bg-gray-800 cursor-pointer ${
                tag === filters?.tag ? "dark:bg-gray-800" : ""
              }`}
            >
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PostsFilters;
