import { useEffect, useState } from "react";
import BlogList from "../../blogs/BlogList2";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostFilters from "./PostsFilters";

const PostsContainer = () => {
  const [activeTab, setActiveTab] = useState("published");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [tag, setTag] = useState("All Tags");
  const [date, setDate] = useState({ from: null, to: null });

  useEffect(() => {
    setSearch("");
    setSort("recent");
    setTag("All Tags");
    setDate({ from: null, to: null });
  }, [activeTab]);

  const allTags = ["All Tags", "React", "Javascript", "Personal", "Tutorial"]; // Fetch dynamically in real case

  const sortOptions = [
    { label: "Recent", value: "recent" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Viewed", value: "views" },
    { label: "Title A–Z", value: "title-asc" },
    { label: "Title Z–A", value: "title-desc" },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full dark:bg-gray-800">
          <TabsTrigger value="published" className="flex-1">
            Published
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex-1">
            Drafts
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex-1">
            Scheduled
          </TabsTrigger>
        </TabsList>

        <PostFilters
          onSearchChange={setSearch}
          onSortChange={setSort}
          onTagChange={setTag}
          onDateChange={setDate}
          tags={allTags}
          sortOptions={sortOptions}
        />

        <TabsContent value="published">
          <BlogList
            status="published"
            mode="dashboard"
            search={search}
            sort={sort}
            tag={tag}
            date={date}
          />
        </TabsContent>

        <TabsContent value="draft">
          <BlogList
            status="draft"
            mode="dashboard"
            search={search}
            sort={sort}
            tag={tag}
            date={date}
          />
        </TabsContent>

        <TabsContent value="scheduled">
          <BlogList
            status="scheduled"
            mode="dashboard"
            search={search}
            sort={sort}
            tag={tag}
            date={date}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostsContainer;
