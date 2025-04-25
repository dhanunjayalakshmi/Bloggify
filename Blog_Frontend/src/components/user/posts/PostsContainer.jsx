import { useState } from "react";
import BlogList from "../../blogs/BlogList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostFilters from "./PostsFilters";

const PostsContainer = () => {
  const [activeTab, setActiveTab] = useState("published");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

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

        <PostFilters onSearchChange={setSearch} onSortChange={setSort} />

        <TabsContent value="published">
          <BlogList
            status="published"
            mode="dashboard"
            search={search}
            sort={sort}
          />
        </TabsContent>

        <TabsContent value="draft">
          <BlogList
            status="draft"
            mode="dashboard"
            search={search}
            sort={sort}
          />
        </TabsContent>

        <TabsContent value="scheduled">
          <BlogList
            status="scheduled"
            mode="dashboard"
            search={search}
            sort={sort}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostsContainer;
