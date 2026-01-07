import { useVoteStore } from "@/stores/votesStore";
import { voteService } from "@/services/voteService";

const useVote = (contentId, contentType) => {
  const key = `${contentType}:${contentId}`;

  const vote = useVoteStore((store) => store?.votesByContent[key]);
  const optimisticVote = useVoteStore((store) => store?.optimisticVote);
  const rollbackVote = useVoteStore((store) => store?.rollbackVote);

  const upvote = async () => {
    const prev = optimisticVote({
      contentId,
      contentType,
      voteType: "upvote",
    });

    try {
      await voteService?.toggleVote({
        contentId,
        contentType,
        voteType: "upvote",
      });
    } catch {
      rollbackVote({ contentId, contentType, prev });
    }
  };

  const downvote = async () => {
    const prev = optimisticVote({
      contentId,
      contentType,
      voteType: "downvote",
    });

    try {
      await voteService?.toggleVote({
        contentId,
        contentType,
        voteType: "downvote",
      });
    } catch {
      rollbackVote({ contentId, contentType, prev });
    }
  };

  return {
    upvotes: vote?.upvotes ?? 0,
    downvotes: vote?.downvotes ?? 0,
    userVote: vote?.userVote ?? null,
    upvote,
    downvote,
  };
};

export default useVote;
