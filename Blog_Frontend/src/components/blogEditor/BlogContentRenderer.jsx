const BlogContentRenderer = ({ content }) => {
  if (!content) return <p>No content available.</p>;

  return (
    <div
      className="prose prose-lg dark:prose-invert tiptap mx-auto max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContentRenderer;
