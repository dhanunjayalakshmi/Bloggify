import { supabase } from "@/lib/supabaseClient";

export const getTagSuggestions = async (searchQuery = "") => {
  try {
    const { data, error } = await supabase.rpc("get_tag_suggestions", {
      search_query: searchQuery,
      result_limit: 8,
    });

    if (error) {
      console.error("Error fetching tag suggestions:", error.message);
      return [];
    }

    return data?.map((item) => item.name) || [];
  } catch (err) {
    console.error("Unexpected error fetching tags:", err);
    return [];
  }
};
