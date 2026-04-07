import api from "@/lib/apiClient";
import { useState } from "react";

export const useEditorImageUpload = (editor, draftId) => {
  const [uploading, setUploading] = useState(false);

  const pickImageFile = () =>
    new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      let settled = false;

      const cleanup = () => {
        window.removeEventListener("focus", handleWindowFocus);
      };

      const finish = (file = null) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(file);
      };

      const handleWindowFocus = () => {
        setTimeout(() => {
          if (!input.files || input.files.length === 0) {
            finish(null);
          }
        }, 300);
      };

      input.addEventListener("change", () => {
        finish(input.files?.[0] || null);
      });

      window.addEventListener("focus", handleWindowFocus, { once: true });

      input.click();
    });

  const handleImageUpload = async (options = { insertToEditor: true }) => {
    try {
      setUploading(true);

      const file = await pickImageFile();

      if (!file || !draftId) {
        return null;
      }

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
