// const PostsContainer = () => {
//   const [activeTab, setActiveTab] = useState("published");
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("recent");
//   const [tag, setTag] = useState("All Tags");
//   const [date, setDate] = useState({ from: null, to: null });

//   const filters = { search, sort, tag, date };

//   useEffect(() => {
//     setSearch("");
//     setSort("recent");
//     setTag("All Tags");
//     setDate({ from: null, to: null });
//   }, [activeTab]);

//   const allTags = ["All Tags", "React", "Javascript", "Personal", "Tutorial"]; // Fetch dynamically in real case

//   const sortOptions = [
//     { label: "Recent", value: "recent" },
//     { label: "Oldest", value: "oldest" },
//     { label: "Most Viewed", value: "views" },
//     // { label: "Title A–Z", value: "title-asc" },
//     // { label: "Title Z–A", value: "title-desc" },
//   ];

//   return (
//     <div className="space-y-4">
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="w-full dark:bg-gray-800">
//           <TabsTrigger value="published" className="flex-1 cursor-pointer">
//             Published
//           </TabsTrigger>
//           <TabsTrigger value="draft" className="flex-1 cursor-pointer">
//             Drafts
//           </TabsTrigger>
//           <TabsTrigger value="scheduled" className="flex-1 cursor-pointer">
//             Scheduled
//           </TabsTrigger>
//         </TabsList>

//         <PostFilters
//           onSearchChange={setSearch}
//           onSortChange={setSort}
//           onTagChange={setTag}
//           onDateChange={setDate}
//           tags={allTags}
//           sortOptions={sortOptions}
//         />

//         <TabsContent value="published">
//           <DashboardPostsList status="published" filters={filters} />
//         </TabsContent>

//         <TabsContent value="draft">
//           <DashboardPostsList status="draft" filters={filters} />
//         </TabsContent>

//         <TabsContent value="scheduled">
//           <DashboardPostsList status="scheduled" filters={filters} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default PostsContainer;

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsFilters from "./PostsFilters";
import DashboardPostsList from "./DashboardPostsList";
import { Button } from "@/components/ui/button";
import { fetchMyBlogs } from "@/services/dashboardService";

const DEFAULT_FILTERS = {
  search: "",
  sort: "recent",
  tag: "All Tags",
  dateRange: { from: null, to: null },
};

const PostsContainer = () => {
  const [activeTab, setActiveTab] = useState("published");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    hasMore: true,
  });
  const [dataState, setDataState] = useState({
    posts: [],
    loading: false,
    error: null,
  });
  const [tags, setTags] = useState(["All Tags"]);

  const sortOptions = [
    { label: "Recent", value: "recent" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Viewed", value: "views" },
  ];

  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    setPagination({ page: 1, limit: 5, hasMore: true });
    setDataState({ posts: [], loading: false, error: null });
  }, [activeTab]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1, hasMore: true }));
    setDataState((prev) => ({ ...prev, posts: [] }));
  }, [filters]);

  useEffect(() => {
    const fetchPosts = async () => {
      setDataState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const res = await fetchMyBlogs({
          status: activeTab,
          search: filters?.search,
          sort: filters?.sort,
          tags: filters?.tag !== "All Tags" ? filters?.tag : undefined,
          dateRange: filters?.dateRange,
          page: pagination?.page,
          limit: pagination?.limit,
        });

        const newPosts = res?.data?.blogs || [];

        setDataState((prev) => ({
          ...prev,
          posts:
            pagination?.page === 1 ? newPosts : [...prev.posts, ...newPosts],
        }));

        setPagination((prev) => ({
          ...prev,
          hasMore: res?.data?.hasMore,
        }));
      } catch (err) {
        setDataState((prev) => ({
          ...prev,
          error: "Failed to load posts..." + err,
        }));
      } finally {
        setDataState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchPosts();
  }, [activeTab, filters, pagination?.page]);

  useEffect(() => {
    // placeholder — we will replace with shared tags API
    setTags(["All Tags", "React", "Javascript", "Tutorial", "Personal"]);
  }, []);

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
        </TabsList>
      </Tabs>

      <PostsFilters
        filters={filters}
        onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
        sortOptions={sortOptions}
        tags={tags}
      />

      <DashboardPostsList
        posts={dataState?.posts}
        loading={dataState?.loading}
        error={dataState?.error}
      />

      {pagination?.hasMore && !dataState?.loading && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))
            }
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostsContainer;
