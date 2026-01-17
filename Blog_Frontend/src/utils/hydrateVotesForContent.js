import { voteService } from "@/services/voteService";
import { useVoteStore } from "@/stores/votesStore";

export const hydrateVotesForContent = async ({ contentType, items }) => {
  if (!items?.length) return;

  const ids = items?.map((blog) => blog?.id)?.filter(Boolean);
  if (!ids?.length) return;

  const res = await voteService?.getVoteCounts({
    contentType,
    ids,
  });

  useVoteStore.getState().setVoteCounts(contentType, res?.data);
};
