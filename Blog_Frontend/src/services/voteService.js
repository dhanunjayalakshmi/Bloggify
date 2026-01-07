import api from "@/lib/apiClient";

export const voteService = {
  toggleVote: ({ contentId, contentType, voteType }) => {
    return api?.post("/votes", {
      content_id: contentId,
      content_type: contentType,
      vote_type: voteType, // "upvote" | "downvote"
    });
  },

  getVoteCounts: ({ contentType, ids }) => {
    if (!ids?.length) return Promise?.resolve({ data: [] });

    return api?.get("/votes/counts", {
      params: {
        content_type: contentType,
        ids: ids?.join(","),
      },
    });
  },
};
