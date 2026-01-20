import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostFilters from "./PostsFilters";
import DashboardPostsList from "./DashboardPostsList";

const PostsContainer = () => {
  const [activeTab, setActiveTab] = useState("published");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [tag, setTag] = useState("All Tags");
  const [date, setDate] = useState({ from: null, to: null });

  const filters = { search, sort, tag, date };

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
          <TabsTrigger value="published" className="flex-1 cursor-pointer">
            Published
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex-1 cursor-pointer">
            Drafts
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex-1 cursor-pointer">
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
          <DashboardPostsList status="published" filters={filters} />
        </TabsContent>

        <TabsContent value="draft">
          <DashboardPostsList status="draft" filters={filters} />
        </TabsContent>

        <TabsContent value="scheduled">
          <DashboardPostsList status="scheduled" filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostsContainer;
