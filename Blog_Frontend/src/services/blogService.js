import api from "@/lib/apiClient";

export const mapSort = (sort) => {
  switch (sort) {
    case "Latest":
      return "newest";

    case "Popular":
      return "popular";

    case "Trending":
      return "trending";

    default:
      return "newest";
  }
};

export const fetchBlogs = async ({
  page = 1,
  limit = 5,
  search = "",
  sort = "Latest",
  tags = "",
  authorId = "",
}) => {
  try {
    const params = new URLSearchParams();

    params?.append("page", page);
    params?.append("limit", limit);
    if (search) params?.append("search", search);
    if (sort) params?.append("sort", mapSort(sort));
    if (tags && tags !== "All Tags") params?.append("tags", tags);
    if (authorId) params?.append("authorId", authorId);

    const { data, error } = await api.get(`/blogs?${params}`);

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("blogService error:", {
      message: err?.message,
      response: err?.response?.data,
    });
  }
};
