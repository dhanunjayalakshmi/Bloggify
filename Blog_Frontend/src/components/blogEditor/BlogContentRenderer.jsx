const BlogContentRenderer = ({ title, description, content, tags }) => {
  return (
    <div className="tiptap prose dark:prose-invert mx-auto p-8 text-center space-y-2">
      <h1 className="text-4xl font-bold">{title || "Untitled Blog"}</h1>
      <p className="text-lg font-normal">{description || "No Description"}</p>

      <div
        dangerouslySetInnerHTML={{
          __html: content || "<p>No content available.</p>",
        }}
      />

      {tags?.length > 0 && (
        <div className="mt-6">
          <strong>Tags:</strong>
          <div className="flex gap-2 flex-wrap mt-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogContentRenderer;
