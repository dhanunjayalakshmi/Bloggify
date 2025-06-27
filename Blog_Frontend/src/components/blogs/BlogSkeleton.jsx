const BlogSkeleton = () => {
  return (
    <div className="animate-pulse border rounded-xl p-4 space-y-4 dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-300">
      <div className="h-48 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />

      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-600 rounded" />
      </div>

      <div className="flex gap-2 mt-4">
        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-4 w-10 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
};

export default BlogSkeleton;
