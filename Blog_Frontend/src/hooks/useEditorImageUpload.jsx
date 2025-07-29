import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export const useEditorImageUpload = (editor) => {
  const [showImageToolbar, setShowImageToolbar] = useState(false);
  const [imageCoords, setImageCoords] = useState({ top: 0, left: 0 });
  const [uploading, setUploading] = useState(false);
  const toolbarRef = useRef();

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
        console.log("Uploaded image =>", uploadedUrl);

        if (uploadedUrl && editor && options.insertToEditor) {
          editor.chain().focus().setImage({ src: uploadedUrl }).run();
        }

        resolve(uploadedUrl);
      };

      input.click();
    });

    return imageUrl;
  };

  useEffect(() => {
    if (!editor) return;

    const { state, view } = editor;
    const { selection } = state;
    const node = selection?.node;

    if (node?.type?.name === "image") {
      const start = selection.from;
      const coords = view.coordsAtPos(start);
      const editorContainer = view.dom.getBoundingClientRect();

      setImageCoords({
        top: coords.top - editorContainer.top + 40,
        left: coords.left - editorContainer.left + 15,
      });

      setShowImageToolbar(true);
    } else {
      setShowImageToolbar(false);
    }
  }, [editor?.state]);

  const ImageSizeToolbar = showImageToolbar ? (
    <div
      ref={toolbarRef}
      className="absolute z-50 p-2 border bg-white rounded shadow-md flex gap-2 animate-fade-in dark:bg-gray-800"
      style={{
        top: `${imageCoords.top}px`,
        left: `${imageCoords.left}px`,
      }}
    >
      {["150", "300", "400", "600", "auto"].map((size) => (
        <Button
          key={size}
          className="px-2 py-1 text-sm border bg-gray-500 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600"
          onClick={() => {
            editor
              .chain()
              .focus()
              .updateAttributes("image", { width: size })
              .run();
            setShowImageToolbar(false);
          }}
        >
          {size === "auto" ? "Original" : `${size}px`}
        </Button>
      ))}
    </div>
  ) : null;

  return { handleImageUpload, uploading, ImageSizeToolbar };
};
