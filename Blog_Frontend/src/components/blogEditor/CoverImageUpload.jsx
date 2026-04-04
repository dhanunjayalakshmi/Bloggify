import { useEditorImageUpload } from "@/hooks/useEditorImageUpload";
import { deleteImageByUrl } from "@/services/blogStorage";
import { ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

const CoverImageUpload = ({ coverImageUrl, setCoverImageUrl, draftId }) => {
  const { handleImageUpload, uploading } = useEditorImageUpload(null, draftId);

  const handleUpload = async () => {
    if (!draftId) {
      console.error("No draftId available for image upload");
      return;
    }

    const previousImage = coverImageUrl;
    const imageUrl = await handleImageUpload({ insertToEditor: false });

    if (imageUrl) {
      setCoverImageUrl(imageUrl);

      if (previousImage && previousImage !== imageUrl) {
        await deleteImageByUrl(previousImage);
      }
    }
  };

  const handleRemoveCover = async (e) => {
    e.stopPropagation();

    const oldImage = coverImageUrl;
    setCoverImageUrl("");

    if (oldImage) {
      const deleted = await deleteImageByUrl(oldImage);
      if (!deleted) {
        toast.error("Failed to remove old cover image from storage");
      }
    }
  };

  return (
    <div
      onClick={handleUpload}
      className="relative mb-6 h-64 w-full md:w-4/5 mx-auto cursor-pointer overflow-hidden rounded-2xl border border-dashed border-slate-400/60 bg-slate-800/30 hover:border-orange-400 transition-colors"
    >
      {uploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <span className="text-white text-sm font-medium">Uploading...</span>
        </div>
      )}

      {coverImageUrl ? (
        <>
          <img
            src={coverImageUrl}
            alt="Cover preview"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveCover}
            className="absolute top-3 right-3 z-20 rounded-full bg-red-500 p-2 text-white shadow hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm text-white">
            Click to replace cover image
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-slate-300">
          <ImageIcon size={34} />
          <span className="mt-2 text-sm font-medium">
            Click to upload cover image
          </span>
          <span className="mt-1 text-xs text-slate-400">
            Recommended wide image for best preview
          </span>
        </div>
      )}
    </div>
  );
};

export default CoverImageUpload;
