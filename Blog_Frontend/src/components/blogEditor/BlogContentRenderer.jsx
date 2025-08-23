const BlogContentRenderer = ({ content }) => (
  <div
    className="prose prose-lg dark:prose-invert tiptap mx-auto"
    dangerouslySetInnerHTML={{
      __html: content || "<p>No content available.</p>",
    }}
  />
);

export default BlogContentRenderer;
