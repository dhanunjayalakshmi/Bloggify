import BlogContentRenderer from "@/components/blogEditor/BlogContentRenderer";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";

const PreviewPage = () => {
  const { state: blog } = useLocation();
  const navigate = useNavigate();

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-screen space-y-6">
        <h2 className="text-2xl font-semibold">Invalid Preview</h2>
        <p className="text-muted-foreground">No blog data available.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 dark:bg-gray-800 mt-6 px-4 py-6 rounded-lg">
      <div className="bg-gray-100 dark:bg-gray-700 text-yellow-700 dark:text-yellow-200 px-4 py-2 text-center text-sm font-medium shadow rounded-lg mb-2">
        🛈 This is a preview. Your blog is not yet published.
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">{blog?.title || "Untitled Blog"}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <span>Preview Mode</span>
          <span>•</span>
          <span>{blog?.read_time} min read</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {blog.coverImageUrl && (
        <div className="mb-4">
          <img
            src={blog.coverImageUrl}
            alt="Cover"
            className="w-2/3 mx-auto object-cover rounded-lg shadow"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert mx-auto w-full">
        <BlogContentRenderer content={blog.content} />
      </div>

      {blog.tags?.length > 0 && (
        <div className="mt-8">
          <strong>Tags:</strong>
          <div className="flex gap-2 flex-wrap mt-1 justify-start">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <Button
        className="mx-auto block w-1/2 max-w-xs mt-8"
        onClick={() => navigate(-1)}
      >
        ← Back to Editor
      </Button>
    </div>
  );
};

export default PreviewPage;
