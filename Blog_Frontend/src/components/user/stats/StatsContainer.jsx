import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, Eye, MessageCircle, ThumbsUp } from "lucide-react";
import KpiCard from "./KpiCard";
import StatsChart from "./StatsChart";
import BlogAnalytics from "./BlogAnalytics";
import BlogStatsTable from "./BlogStatsTable";
import { useEffect, useState } from "react";
import {
  fetchAggregatedStats,
  fetchDashboardBlogs,
} from "@/services/dashboardService";

const StatsContainer = () => {
  const [stats, setStats] = useState({});
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchAggregatedStats();
        setStats(res?.data);
      } catch (err) {
        console.error("Stats load failed", err);
      }
    };

    const loadBlogs = async () => {
      try {
        const collectedBlogs = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const res = await fetchDashboardBlogs({
            status: "published",
            page,
            limit: 50,
          });

          const pageBlogs = res?.data?.blogs || [];
          collectedBlogs.push(...pageBlogs);
          hasMore = Boolean(res?.data?.hasMore);
          page += 1;
        }

        setBlogs(collectedBlogs);
      } catch (err) {
        console.log("Blogs load failed", err);
      }
    };

    loadStats();
    loadBlogs();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex gap-4 dark:bg-gray-800 ">
          <TabsTrigger
            value="overview"
            className="cursor-pointer p-4 hover:bg-gray-300 dark:hover:bg-gray-900"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="blog-stats"
            className="cursor-pointer p-4 hover:bg-gray-300 dark:hover:bg-gray-900"
          >
            Blog Stats
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="cursor-pointer p-4 hover:bg-gray-300 dark:hover:bg-gray-900"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <KpiCard
              icon={BarChart3}
              label="Total Blogs"
              value={stats?.totalBlogs}
              color="text-purple-500"
            />
            <KpiCard
              icon={Eye}
              label="Total Views"
              value={stats?.totalViews}
              color="text-blue-500"
            />
            <KpiCard
              icon={MessageCircle}
              label="Total Comments"
              value={stats?.totalComments}
              color="text-orange-500"
            />
            <KpiCard
              icon={ThumbsUp}
              label="Total Upvotes"
              value={stats?.totalUpvotes}
              color="text-green-500"
            />
          </div>

          {/* CHARTS */}
          <StatsChart blogs={blogs} />
        </TabsContent>

        <TabsContent value="blog-stats">
          <BlogStatsTable blogs={blogs} />
        </TabsContent>

        <TabsContent value="analytics">
          <BlogAnalytics blogs={blogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsContainer;
