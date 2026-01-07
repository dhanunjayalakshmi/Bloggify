import { create } from "zustand";

const makeKey = (type, id) => `${type}:${id}`;

export const useVoteStore = create((set, get) => ({
  votesByContent: {},

  setVoteCounts: (contentType, votesArray) =>
    set((state) => {
      const updated = { ...state.votesByContent };

      votesArray.forEach((vote) => {
        updated[makeKey(contentType, vote.content_id)] = {
          upvotes: vote.upvotes,
          downvotes: vote.downvotes,
          userVote: vote.user_vote,
        };
      });

      return { votesByContent: updated };
    }),

  optimisticVote: ({ contentType, contentId, voteType }) => {
    const key = makeKey(contentType, contentId);

    const prev = get().votesByContent[key] ?? {
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    };

    let { upvotes, downvotes, userVote } = prev;

    if (userVote === voteType) {
      if (voteType === "upvote") upvotes--;
      if (voteType === "downvote") downvotes--;
      userVote = null;
    } else {
      if (userVote === "upvote") upvotes--;
      if (userVote === "downvote") downvotes--;

      if (voteType === "upvote") upvotes++;
      if (voteType === "downvote") downvotes++;

      userVote = voteType;
    }

    set((state) => ({
      votesByContent: {
        ...state?.votesByContent,
        [key]: { upvotes, downvotes, userVote },
      },
    }));

    return prev;
  },

  rollbackVote: ({ contentType, contentId, prev }) =>
    set((state) => ({
      votesByContent: {
        ...state.votesByContent,
        [makeKey(contentType, contentId)]: prev,
      },
    })),
}));
