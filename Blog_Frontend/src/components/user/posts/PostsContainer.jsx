import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsFilters from "./PostsFilters";
import DashboardPostsList from "./DashboardPostsList";
import { Button } from "@/components/ui/button";
import { fetchDashboardBlogs } from "@/services/dashboardService";

const DEFAULT_FILTERS = {
  search: "",
  sort: "recent",
  tag: "All Tags",
};

const PostsContainer = () => {
  const [activeTab, setActiveTab] = useState("published");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState(filters?.search);
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
  }, [filters?.sort, filters?.tag]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(filters?.search);
    }, 300);

    return () => clearTimeout(id);
  }, [filters?.search]);

  useEffect(() => {
    const fetchPosts = async () => {
      setDataState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const res = await fetchDashboardBlogs({
          status: activeTab,
          search: debouncedSearch,
          sort: filters?.sort,
          tags: filters?.tag !== "All Tags" ? filters?.tag : undefined,
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
  }, [
    activeTab,
    debouncedSearch,
    filters?.sort,
    filters?.tag,
    pagination?.page,
  ]);

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
