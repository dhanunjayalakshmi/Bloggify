const validateBlog = (title, content) => {
  if (!title || !content) {
    return { validationError: "Title and content are required" };
  }

  if (title.trim().length > 100) {
    return { validationError: "Title length cannot exceed 100 characters" };
  }

  if (!title.trim()) {
    return { validationError: "Title cannot be empty" };
  }

  if (!content.trim()) {
    return { validationError: "Content cannot be empty" };
  }

  return { validationError: null };
};

module.exports = { validateBlog };
