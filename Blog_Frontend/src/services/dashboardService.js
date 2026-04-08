import api from "@/lib/apiClient";

export const fetchDashboardBlogs = ({
  status = "published",
  search,
  sort,
  tags,
  dateRange,
  page,
  limit,
} = {}) => {
  const params = new URLSearchParams();

  params?.append("status", status);
  if (page) params?.append("page", page);
  if (limit) params?.append("limit", limit);

  if (search) params?.append("search", search);
  if (sort) params?.append("sort", sort);
  if (tags && tags !== "All Tags") params?.append("tags", tags);

  if (dateRange?.from) params?.append("from", dateRange.from.toISOString());
  if (dateRange?.to) params?.append("to", dateRange.to.toISOString());

  return api.get(`/dashboard/blog-stats?${params}`);
};

export const fetchAggregatedStats = () => {
  return api.get("/dashboard/stats");
};
