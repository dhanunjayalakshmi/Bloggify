import { useState } from "react";
import BlogList from "../../blogs/BlogList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const PostsContainer = () => {
  const [activeTab, setActiveTab] = useState("published");

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
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

        <TabsContent value="published">
          <BlogList status="published" mode="dashboard" />
        </TabsContent>

        <TabsContent value="draft">
          <BlogList status="draft" mode="dashboard" />
        </TabsContent>

        <TabsContent value="scheduled">
          <BlogList status="scheduled" mode="dashboard" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostsContainer;
