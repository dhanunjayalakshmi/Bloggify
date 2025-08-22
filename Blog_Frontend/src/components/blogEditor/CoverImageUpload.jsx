import { useEditorImageUpload } from "@/hooks/useEditorImageUpload";
import { ImageIcon, X } from "lucide-react";

const CoverImageUpload = ({ coverImageUrl, setCoverImageUrl, draftId }) => {
  const { handleImageUpload, uploading } = useEditorImageUpload(null, draftId);

  const handleUpload = async () => {
    if (!draftId) {
      console.error("No draftId available for image upload");
      return;
    }
    
    const imageUrl = await handleImageUpload({ insertToEditor: false });
    if (imageUrl) {
      setCoverImageUrl(imageUrl);
    }
  };

  return (
    <div
      onClick={handleUpload}
      className="relative mb-4 h-64 w-2/3 mx-auto cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
    >
      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
          <span className="text-white">Uploading...</span>
        </div>
      )}

      {coverImageUrl ? (
        <>
          <img
            src={coverImageUrl}
            alt="Cover preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCoverImageUrl("");
            }}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors z-20"
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <ImageIcon size={32} />
          <span className="mt-2 text-sm">Click to upload cover image</span>
        </div>
      )}
    </div>
  );
};

export default CoverImageUpload;
