import api from "@/lib/apiClient";

export async function addBookmark(blogId) {
  try {
    const res = await api.post("/bookmarks/", { blog_id: blogId });

    if (!res?.data) throw new Error("Failed to add bookmark");
    return res?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeBookmark(blogId) {
  try {
    const res = await api.post("/bookmarks/", { blog_id: blogId });

    if (!res?.data) throw new Error("Failed to remove bookmark");
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
