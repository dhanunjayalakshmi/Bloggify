import { useEffect, useState } from "react";
import { Plus, Check } from "lucide-react";
import { getFollowedTags, toggleTagFollow } from "@/services/tagFollowService";
import { useNavigate } from "react-router-dom";

const TagFollowButton = ({ tag }) => {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tag) return;
    getFollowedTags()
      .then((res) => {
        const tags = res.data.tags || [];
        setFollowing(tags.includes(tag.toLowerCase()));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tag]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const res = await toggleTagFollow(tag);
      setFollowing(res.data.following);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer select-none ${
        following
          ? "border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
          : "border-gray-200 bg-muted text-muted-foreground hover:border-gray-400 dark:border-gray-700"
      }`}
    >
      <span
        onClick={() => navigate(`/tags/${tag}`)}
        className="hover:underline"
      >
        #{tag}
      </span>

      <button
        onClick={handleToggle}
        disabled={loading}
        aria-label={following ? `Unfollow ${tag}` : `Follow ${tag}`}
        className={`flex items-center justify-center rounded-full transition-colors ${
          following
            ? "text-blue-500 dark:text-blue-400"
            : "text-muted-foreground group-hover:text-foreground"
        }`}
      >
        {loading ? (
          <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : following ? (
          <Check size={11} strokeWidth={2.5} />
        ) : (
          <Plus size={11} strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
};

export default TagFollowButton;
