import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, GripVertical, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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


const SortableBlogItem = ({ blog, index, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: blog.blogId });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-bold text-blue-600 dark:text-blue-400">
        {index + 1}
      </span>
      <span className="flex-1 text-sm truncate">{blog.title}</span>
      <button
        onClick={() => onRemove(blog.blogId)}
        className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  );
};

const SeriesTab = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addingBlogTo, setAddingBlogTo] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event, seriesId) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSeriesList((prev) =>
      prev.map((s) => {
        if (s.id !== seriesId) return s;
        const oldIndex = s.blogs.findIndex((b) => b.blogId === active.id);
        const newIndex = s.blogs.findIndex((b) => b.blogId === over.id);
        const reordered = arrayMove(s.blogs, oldIndex, newIndex).map(
          (b, i) => ({ ...b, order: i }),
        );
        api
          .patch(`/series/${seriesId}/blogs/reorder`, {
            order: reordered.map((b) => ({ blogId: b.blogId, orderIndex: b.order })),
          })
          .catch(() => toast.error("Failed to save order"));
        return { ...s, blogs: reordered };
      }),
    );
  };

  useEffect(() => {
    Promise.all([
      api.get("/series/mine"),
      api.get("/dashboard/blog-stats?status=published&limit=50"),
    ])
      .then(([seriesRes, blogsRes]) => {
        setSeriesList(seriesRes.data.series || []);
        setMyBlogs(blogsRes.data.blogs || []);
      })
      .catch(() => toast.error("Failed to load series"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await api.post("/series", { title: newTitle, description: newDesc });
      setSeriesList((prev) => [{ ...res.data.series, blogs: [] }, ...prev]);
      setNewTitle("");
      setNewDesc("");
      setCreating(false);
      toast.success("Series created!");
    } catch {
      toast.error("Failed to create series");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/series/${id}`);
      setSeriesList((prev) => prev.filter((s) => s.id !== id));
      toast.success("Series deleted");
    } catch {
      toast.error("Failed to delete series");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleAddBlog = async (seriesId, blogId) => {
    const series = seriesList.find((s) => s.id === seriesId);
    if (!series) return;
    if (series.blogs.some((b) => b.blogId === blogId)) {
      toast.error("Blog already in this series");
      return;
    }
    const orderIndex = series.blogs.length;
    try {
      await api.post(`/series/${seriesId}/blogs`, { blog_id: blogId, order_index: orderIndex });
      const blog = myBlogs.find((b) => b.id === blogId);
      setSeriesList((prev) =>
        prev.map((s) =>
          s.id === seriesId
            ? { ...s, blogs: [...s.blogs, { blogId, title: blog?.title, order: orderIndex }] }
            : s,
        ),
      );
      toast.success("Blog added to series");
    } catch {
      toast.error("Failed to add blog");
    } finally {
      setAddingBlogTo(null);
    }
  };

  const handleRemoveBlog = async (seriesId, blogId) => {
    try {
      await api.delete(`/series/${seriesId}/blogs/${blogId}`);
      setSeriesList((prev) =>
        prev.map((s) =>
          s.id === seriesId
            ? { ...s, blogs: s.blogs.filter((b) => b.blogId !== blogId) }
            : s,
        ),
      );
      toast.success("Blog removed from series");
    } catch {
      toast.error("Failed to remove blog");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Series</h2>
        <Button size="sm" onClick={() => setCreating((v) => !v)}>
          <Plus className="mr-1 h-4 w-4" /> New Series
        </Button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="rounded-xl border dark:border-gray-700 p-4 space-y-3">
          <Input
            placeholder="Series title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            rows={2}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={!newTitle.trim()}>
              Create
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {seriesList.length === 0 && !creating && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-4xl">📚</span>
          <p className="text-muted-foreground font-medium">No series yet</p>
          <p className="text-sm text-muted-foreground">
            Group your related blogs into a series so readers can follow along
          </p>
        </div>
      )}

      {/* Series list */}
      {seriesList.map((series) => (
        <div key={series.id} className="rounded-xl border bg-background dark:bg-gray-900 dark:border-gray-700 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-base">{series.title}</h3>
              {series.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{series.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {series.blogs.length} part{series.blogs.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-600 shrink-0"
              onClick={() => setDeleteTarget(series.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Blog parts — drag to reorder */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, series.id)}
          >
            <SortableContext
              items={series.blogs.map((b) => b.blogId)}
              strategy={verticalListSortingStrategy}
            >
              <ol className="space-y-2">
                {series.blogs.map((blog, idx) => (
                  <SortableBlogItem
                    key={blog.blogId}
                    blog={blog}
                    index={idx}
                    onRemove={(blogId) => handleRemoveBlog(series.id, blogId)}
                  />
                ))}
              </ol>
            </SortableContext>
          </DndContext>

          {/* Add blog dropdown */}
          {addingBlogTo === series.id ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Select a blog to add:</p>
              <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border dark:border-gray-700 p-2">
                {myBlogs
                  .filter((b) => !series.blogs.some((sb) => sb.blogId === b.id))
                  .map((blog) => (
                    <button
                      key={blog.id}
                      onClick={() => handleAddBlog(series.id, blog.id)}
                      className="w-full text-left rounded px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {blog.title}
                    </button>
                  ))}
                {myBlogs.filter((b) => !series.blogs.some((sb) => sb.blogId === b.id)).length === 0 && (
                  <p className="text-xs text-muted-foreground px-3 py-2">All your blogs are already in this series</p>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={() => setAddingBlogTo(null)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddingBlogTo(series.id)}
            >
              <Plus className="mr-1 h-3 w-3" /> Add Blog
            </Button>
          )}
        </div>
      ))}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this series?</AlertDialogTitle>
            <AlertDialogDescription>
              The series will be deleted but your blogs won't be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(deleteTarget)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SeriesTab;
