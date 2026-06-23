import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/apiClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, X, Clock } from "lucide-react";
import { toast } from "sonner";

const relativeTime = (iso) => {
  if (!iso) return "";
  const hasTimezone = iso.endsWith("Z") || /[+-]\d{2}:?\d{2}$/.test(iso);
  const d = new Date(hasTimezone ? iso : iso + "Z");
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const HistorySkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
        <div className="w-20 h-14 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const HistoryItem = ({ blog, onRemove }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
      {blog?.cover_image && (
        <img
          src={blog.cover_image}
          alt=""
          className="w-20 h-14 object-cover rounded flex-shrink-0 cursor-pointer"
          onClick={() => navigate(`/blogs/${blog.id}`)}
        />
      )}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => navigate(`/blogs/${blog.id}`)}
      >
        <h3 className="font-medium text-sm leading-snug line-clamp-2 text-gray-900 dark:text-white">
          {blog.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
          <span>{blog.users?.name || "Unknown"}</span>
          <span>·</span>
          <span>{blog.read_time} min read</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {relativeTime(blog.read_at)}
          </span>
        </div>
        {blog.tags?.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {blog.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(blog.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
        title="Remove from history"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

const HistoryContainer = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [clearing, setClearing] = useState(false);

  const fetchHistory = useCallback(async (pageNum = 1, append = false) => {
    try {
      const res = await api.get("/users/me/history", { params: { page: pageNum, limit: 15 } });
      const { history: items, hasMore: more } = res.data;
      setHistory((prev) => append ? [...prev, ...items] : items);
      setHasMore(more);
      setPage(pageNum);
    } catch {
      toast.error("Failed to load reading history");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const handleRemove = async (blogId) => {
    setHistory((prev) => prev.filter((b) => b.id !== blogId));
    try {
      await api.delete(`/users/me/history/${blogId}`);
    } catch {
      toast.error("Failed to remove item");
      fetchHistory(1);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all reading history?")) return;
    setClearing(true);
    try {
      await api.delete("/users/me/history");
      setHistory([]);
      setHasMore(false);
      toast.success("History cleared");
    } catch {
      toast.error("Failed to clear history");
    } finally {
      setClearing(false);
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    fetchHistory(page + 1, true);
  };

  const filtered = history.filter((b) =>
    search ? b.title?.toLowerCase().includes(search.toLowerCase()) : true
  );

  if (loading) return <HistorySkeleton />;

  if (!history.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600" />
        <p className="text-muted-foreground font-medium">No reading history yet</p>
        <button
          className="text-sm text-orange-500 hover:underline"
          onClick={() => navigate("/home")}
        >
          Start reading blogs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          placeholder="Search history..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          disabled={clearing}
          className="flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950 dark:border-red-900 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
          Clear all
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <span className="text-3xl">🔍</span>
          <p className="text-muted-foreground">No results for "{search}"</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((blog) => (
            <HistoryItem key={blog.id} blog={blog} onRemove={handleRemove} />
          ))}
        </div>
      )}

      {hasMore && !search && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryContainer;
