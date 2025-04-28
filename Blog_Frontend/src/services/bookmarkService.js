// src/services/bookmarkService.js

export async function addBookmark(blogId) {
  try {
    const res = await fetch(`/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogId }),
    });

    if (!res.ok) throw new Error("Failed to add bookmark");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeBookmark(blogId) {
  try {
    const res = await fetch(`/api/bookmarks/${blogId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to remove bookmark");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
