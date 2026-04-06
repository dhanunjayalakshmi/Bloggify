const BlogContentRenderer = ({ content }) => {
  if (!content) return <p>No content available.</p>;

  return (
    <div
      className="
        prose prose-lg dark:prose-invert tiptap mx-auto max-w-none
        [&_img]:my-6
        [&_img]:rounded-2xl
        [&_img]:shadow-sm
        [&_img[data-align='left']]:mr-auto
        [&_img[data-align='left']]:ml-0
        [&_img[data-align='center']]:mx-auto
        [&_img[data-align='right']]:ml-auto
        [&_img[data-align='right']]:mr-0
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContentRenderer;
