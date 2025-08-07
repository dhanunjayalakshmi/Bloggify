import { useState } from "react";

export const useEditorImageUpload = (editor) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    setUploading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
        setUploading(false);
      }, 1000);
    });
  };

  const handleImageUpload = async (options = { insertToEditor: true }) => {
    const imageUrl = await new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);

        const uploadedUrl = await uploadImage(file);
        if (uploadedUrl && editor && options.insertToEditor) {
          editor.chain().focus().setImage({ src: uploadedUrl }).run();
        }
        resolve(uploadedUrl);
      };

      input.click();
    });

    return imageUrl;
  };

  return { handleImageUpload, uploading };
};
