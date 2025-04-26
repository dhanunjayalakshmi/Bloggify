import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import DateRangePicker from "@/components/ui/date-range-picker";
import { Tag } from "lucide-react";

const PostFilters = ({
  onSearchChange,
  onSortChange,
  onTagChange,
  onDateChange,
  tags = [],
  sortOptions = [],
}) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [selectedTag, setSelectedTag] = useState("All Tags");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchChange(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    onTagChange(selectedTag);
  }, [selectedTag]);

  useEffect(() => {
    onDateChange(dateRange);
  }, [dateRange]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between py-2">
      <Input
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-sm w-full"
      />

      <Select
        value={sort}
        onValueChange={(val) => {
          setSort(val);
          onSortChange(val);
        }}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-700">
          {sortOptions?.map((sortOption) => (
            <SelectItem
              value={sortOption?.value}
              className={`hover:dark:bg-gray-800 ${
                sortOption?.value === sort ? "dark:bg-gray-800" : ""
              }`}
            >
              {sortOption?.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTag} onValueChange={(val) => setSelectedTag(val)}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Filter By Tag" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-700">
          {tags.map((tag) => (
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

      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        placeholder="Filter by date"
      />
    </div>
  );
};

export default PostFilters;
