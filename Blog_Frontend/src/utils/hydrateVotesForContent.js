import { voteService } from "@/services/voteService";
import { useVoteStore } from "@/stores/votesStore";

export const hydrateVotesForContent = async ({ contentType, blogs }) => {
  if (!blogs?.length) return;

  const ids = blogs?.map((blog) => blog?.id)?.filter(Boolean);
  if (!ids?.length) return;

  const res = await voteService?.getVoteCounts({
    contentType,
    ids,
  });

  useVoteStore.getState().setVoteCounts(contentType, res?.data);
};
