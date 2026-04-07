const EditorModeBadge = ({ isEditMode, isPublishedBlog }) => {
  return (
    <div className="px-4 pt-2 mt-4">
      <div className="mx-auto max-w-5xl">
        <span className="inline-flex items-center rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300">
          {isEditMode
            ? isPublishedBlog
              ? "Editing published blog"
              : "Editing draft blog"
            : "New draft"}
        </span>
      </div>
    </div>
  );
};

export default EditorModeBadge;
