import BlogContentRenderer from "@/components/blogEditor/BlogContentRenderer";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditorPreview = !!location?.state;
  const mode = isEditorPreview ? "editor" : "dashboard";

  const [blog, setBlog] = useState(location?.state || null);
  const [loading, setLoading] = useState(!isEditorPreview);
  const [error, setError] = useState(null);
  const previewCoverImage = blog?.cover_image || blog?.coverImageUrl || "";

  useEffect(() => {
    if (mode === "dashboard") {
      const loadBlog = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/dashboard/posts/${id}`);
          setBlog(res?.data);
        } catch (err) {
          setError("Post not found or access denied");
          console.log("Error...", err);
        } finally {
          setLoading(false);
        }
      };

      loadBlog();
    }
  }, [mode, id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/blogs/${blog.id}`);

      toast.success("Blog deleted successfully");

      navigate("/profile/posts"); // or dashboard posts page
    } catch (err) {
      console.error("Delete blog error:", err);
      toast.error("Failed to delete blog");
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading preview...</p>;
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-screen space-y-6">
        <h2 className="text-2xl font-semibold">Invalid Preview</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 bg-white dark:bg-gray-800 m-6 px-4 py-6 rounded-lg max-w-4xl mx-auto">
      {mode === "editor" && (
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 text-center text-sm font-medium rounded-lg">
          🛈 This is a preview. Your blog is not yet published.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">{blog?.title || "Untitled Blog"}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>{mode === "editor" ? "Preview Mode" : "Owner Preview"}</span>
          <span>•</span>
          <span>{blog?.read_time || 1} min read</span>
          <span>•</span>
          <span>
            {new Date(blog?.updated_at || Date.now()).toLocaleDateString()}
          </span>
        </div>
      </div>

      {previewCoverImage && (
        <img
          src={previewCoverImage}
          alt="Cover"
          className="w-full max-h-[400px] object-cover rounded-lg shadow"
        />
      )}

      <div className="prose prose-lg dark:prose-invert">
        <BlogContentRenderer content={blog?.content} />
      </div>

      {blog?.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {blog?.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4">
        {mode === "editor" && (
          <Button onClick={() => navigate(-1)}>← Back to Editor</Button>
        )}

        {mode === "dashboard" && (
          <>
            <Button size="sm" onClick={() => navigate(`/editor/${blog?.id}`)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>

            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
