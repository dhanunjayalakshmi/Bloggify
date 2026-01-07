import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import useVote from "@/hooks/useVote";

const ContentVotes = ({
  contentId,
  contentType,
  className = "",
  disabled = false,
}) => {
  const { upvotes, downvotes, userVote, upvote, downvote } = useVote(
    contentId,
    contentType
  );

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Button
        disabled={disabled}
        variant={userVote === "upvote" ? "solid" : "ghostButton"}
        aria-label="Upvote"
        onClick={upvote}
      >
        <ThumbsUp className="h-5 w-5" />
        <span>{upvotes}</span>
      </Button>
      <Button
        disabled={disabled}
        variant={userVote === "downvote" ? "solid" : "ghostButton"}
        aria-label="Downvote"
        onClick={downvote}
      >
        <ThumbsDown className="h-5 w-5" />
        <span>{downvotes}</span>
      </Button>
    </div>
  );
};

export default ContentVotes;
