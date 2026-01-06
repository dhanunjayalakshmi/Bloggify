import api from "@/lib/apiClient";

export async function toggleBookmark(blogId) {
  try {
    const res = await api.post("/bookmarks/", { blog_id: blogId });

    if (!res?.data) throw new Error("Failed to add bookmark");
    return res?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getBookmarks() {
  try {
    const res = await api.get("/bookmarks/");

    if (!res?.data) throw new Error("Failed to fetch bookmarks");
    return res?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getBookmarkedBlogs() {
  try {
    const res = await api.get("/bookmarks/blogs");

    if (!res?.data) throw new Error("Failed to fetch bookmarked blog details");
    return res?.data?.blogs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
