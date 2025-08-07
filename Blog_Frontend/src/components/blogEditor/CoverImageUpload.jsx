import { useEditorImageUpload } from "@/hooks/useEditorImageUpload";

import { ImageIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const CoverImageUpload = ({ coverImageUrl, setCoverImageUrl, editor }) => {
  const { handleImageUpload, ImageSizeToolbar } = useEditorImageUpload(editor);

  const coverImageUpload = async () => {
    if (!editor) {
      toast.error("Editor not ready. Please try again later.");
      return;
    }

    const imageUrl = await handleImageUpload({ insertToEditor: false });
    if (imageUrl) {
      setCoverImageUrl(imageUrl);
    }
  };

  return (
    <>
      <div
        onClick={coverImageUpload}
        className="relative mb-4 h-64 w-2/3 mx-auto cursor-pointer flex flex-col gap-2 items-center justify-center border-2 border-dashed rounded-lg overflow-hidden text-gray-400 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 group transition-all"
      >
        {coverImageUrl ? (
          <>
            <img
              src={coverImageUrl}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <Button
              variant="icon"
              onClick={(e) => {
                e.stopPropagation();
                setCoverImageUrl("");
              }}
              className="absolute top-2 right-2 z-50 bg-black/60 text-white rounded-full hover:bg-black/80"
            >
              <X className="" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-600 dark:text-gray-300 pointer-events-none">
            <ImageIcon size={32} />
            <span className="text-sm font-medium">Upload Cover Image</span>
          </div>
        )}
      </div>

      {ImageSizeToolbar}
    </>
  );
};

export default CoverImageUpload;
