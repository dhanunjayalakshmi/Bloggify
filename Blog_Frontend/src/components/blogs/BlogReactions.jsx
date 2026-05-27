import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const EMOJIS = ["❤️", "🔥", "💡", "🤔", "🎉"];

const BlogReactions = ({ blogId }) => {
  const [counts, setCounts] = useState({});
  const [userReactions, setUserReactions] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;
    api
      .get(`/reactions/${blogId}`)
      .then((res) => {
        setCounts(res.data.counts || {});
        setUserReactions(new Set(res.data.userReactions || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [blogId]);

  const handleToggle = async (emoji) => {
    const reacted = userReactions.has(emoji);

    setUserReactions((prev) => {
      const next = new Set(prev);
      reacted ? next.delete(emoji) : next.add(emoji);
      return next;
    });
    setCounts((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + (reacted ? -1 : 1),
    }));

    try {
      await api.post("/reactions", { blog_id: blogId, emoji });
    } catch {
      setUserReactions((prev) => {
        const next = new Set(prev);
        reacted ? next.add(emoji) : next.delete(emoji);
        return next;
      });
      setCounts((prev) => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + (reacted ? 1 : -1),
      }));
    }
  };

  if (loading) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleToggle(emoji)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all hover:scale-105 active:scale-95 ${
            userReactions.has(emoji)
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500 font-medium"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <span>{emoji}</span>
          {counts[emoji] > 0 && (
            <span className="text-xs text-muted-foreground">{counts[emoji]}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default BlogReactions;
