import BlogContentRenderer from "@/components/blogEditor/BlogContentRenderer";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditorPreview = !!location?.state;
  const mode = isEditorPreview ? "editor" : "dashboard";

  const [blog, setBlog] = useState(location?.state || null);
  const [loading, setLoading] = useState(!isEditorPreview);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
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
          console.error("Failed to load preview:", err);
        } finally {
          setLoading(false);
        }
      };

      loadBlog();
    }
  }, [mode, id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/blogs/${blog.id}`);
      toast.success("Blog deleted successfully");
      navigate("/profile/posts");
    } catch (err) {
      console.error("Delete blog error:", err);
      toast.error("Failed to delete blog");
    }
  };

  if (loading) {
    return <p className="mt-20 text-center">Loading preview...</p>;
  }

  if (error || !blog) {
    return (
      <div className="mx-auto flex h-screen max-w-4xl flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-semibold">Invalid Preview</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <>
    <div className="mx-auto my-6 max-w-5xl px-4">
      <div className="rounded-3xl border border-slate-200 bg-white px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:px-8 md:py-8">
        {mode === "editor" && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            This is a preview. Your blog is not yet published.
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
            {blog?.title || "Untitled Blog"}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
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
            className="mb-8 max-h-[420px] w-full rounded-3xl object-cover shadow-sm"
          />
        )}

        <div className="prose prose-slate prose-lg max-w-3xl dark:prose-invert dark:prose-headings:text-slate-100 dark:prose-p:text-slate-300 dark:prose-strong:text-slate-100 dark:prose-li:text-slate-300">
          <BlogContentRenderer content={blog?.content} />
        </div>

        {blog?.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {mode === "editor" && (
            <Button onClick={() => navigate(-1)}>Back to Editor</Button>
          )}

          {mode === "dashboard" && (
            <>
              <Button size="sm" onClick={() => navigate(`/editor/${blog?.id}`)}>
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>

              <Button size="sm" variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The blog will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PreviewPage;
