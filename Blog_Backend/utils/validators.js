const validateBlog = (title, content) => {
  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  if (title?.length > 100) {
    return { error: "Title length cannot exceed 100 characters" };
  }

  return { error: null };
};

module.exports = { validateBlog };
