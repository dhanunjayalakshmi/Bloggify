import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

const BlogVotes = ({ blogId }) => {
  const [votes, setVotes] = useState({
    total_upvotes: 0,
    total_downvotes: 0,
    user_vote: null,
  });
  const [loading, setLoading] = useState(false);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/votes/count?content_id=${blogId}&content_type=blog`
      );
      setVotes(res?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
    // Optionally: Add websocket or polling for live updates
  }, [blogId]);

  const handleVote = async (voteType) => {
    setLoading(true);
    await api.post("/votes", {
      content_id: blogId,
      content_type: "blog",
      vote_type: voteType,
    });
    await fetchVotes();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <Button
        disabled={loading}
        variant={votes?.user_vote === "upvote" ? "solid" : "ghostButton"}
        aria-label="Upvote"
        onClick={() => handleVote("upvote")}
      >
        <ThumbsUp className="h-5 w-5" />
        <span>{votes?.total_upvotes}</span>
      </Button>
      <Button
        disabled={loading}
        variant={votes.user_vote === "downvote" ? "solid" : "ghostButton"}
        aria-label="Downvote"
        onClick={() => handleVote("downvote")}
      >
        <ThumbsDown className="h-5 w-5" />
        <span>{votes?.total_downvotes}</span>
      </Button>
    </div>
  );
};

export default BlogVotes;
