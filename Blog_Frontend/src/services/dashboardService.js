import api from "@/lib/apiClient";

export const fetchMyBlogs = ({ status, search, sort, tags, dateRange }) => {
  const params = new URLSearchParams();

  params?.append("status", status);

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

export const fetchBlogStats = ({ page = 1, limit = 10 } = {}) => {
  return api.get("/dashboard/blog-stats", {
    params: { page, limit },
  });
};
