import api from "@/lib/apiClient";
import { useState } from "react";

export const useEditorImageUpload = (editor, draftId) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (options = { insertToEditor: true }) => {
    try {
      setUploading(true);

      const file = await new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => resolve(input.files?.[0]);
        input.click();
      });

      if (!file || !draftId) return null;

      const formData = new FormData();
      formData.append("image", file);
      formData.append("draftId", draftId);

      const response = await api.post("/blogs/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { imageUrl } = response.data;

      if (imageUrl && editor && options.insertToEditor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }

      return imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { handleImageUpload, uploading };
};
