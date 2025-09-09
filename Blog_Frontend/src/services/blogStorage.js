import { supabase } from "@/lib/supabaseClient";

// Delete all images for a given draftId from Supabase Storage
export const deleteDraftImages = async (draftId) => {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from("blog-images")
      .list(draftId);

    if (!listError && files && files.length > 0) {
      const pathsToDelete = files.map((file) => `${draftId}/${file.name}`);

      const { error: deleteError } = await supabase.storage
        .from("blog-images")
        .remove(pathsToDelete);

      if (deleteError) {
        console.error(
          "Failed to delete images for draftId:",
          draftId,
          deleteError
        );
      }
    }

    return true;
  } catch (err) {
    console.error("Unexpected error deleting draft images:", err);
    return false;
  }
};
