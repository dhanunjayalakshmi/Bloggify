import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, Eye, MessageCircle, ThumbsUp } from "lucide-react";
import KpiCard from "./KpiCard";
import StatsChart from "./StatsChart";
import BlogAnalytics from "./BlogAnalytics";
import BlogStatsTable from "./BlogsTable";

const dummyEngagement = [
  { date: "Apr 1", engagement: 10 },
  { date: "Apr 2", engagement: 40 },
  { date: "Apr 3", engagement: 25 },
];

const dummyBlogs = [
  {
    id: 1,
    title: "React Hooks",
    views: 120,
    upvotes: 30,
    comments: 5,
    status: "Published",
    updated: "2025-04-25",
  },
  // ...
];

const dummyAnalytics = [
  {
    id: 1,
    title: "React Basics",
    readTime: 5,
    traffic: { direct: 30, search: 40, social: 20 },
  },
];

const StatsContainer = () => {
  return (
    <div className="p-4 space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="flex gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blog-stats">Blog Stats</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={BarChart3} label="Total Blogs" value="12" />
            <KpiCard icon={Eye} label="Total Views" value="1,540" />
            <KpiCard icon={MessageCircle} label="Total Comments" value="210" />
            <KpiCard icon={ThumbsUp} label="Total Upvotes" value="620" />
          </div>
          <StatsChart data={dummyEngagement} />
        </TabsContent>

        <TabsContent value="blog-stats">
          <BlogStatsTable blogs={dummyBlogs} />
        </TabsContent>

        <TabsContent value="analytics">
          <BlogAnalytics analytics={dummyAnalytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsContainer;
