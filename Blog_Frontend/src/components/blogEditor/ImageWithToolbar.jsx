import { NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";

const ImageWithToolbar = ({ node, selected, updateAttributes }) => {
  return (
    <NodeViewWrapper className="image-with-toolbar w-full">
      {selected && (
        <div className="mb-2 p-2 bg-white dark:bg-gray-800 animate-fade-in rounded flex gap-2 justify-center">
          {["400", "600", "780", "1000", "auto"].map((size) => (
            <Button
              key={size}
              size="sm"
              variant="outline"
              className="px-2 py-1 text-xs"
              onClick={() => updateAttributes({ width: size })}
            >
              {size === "auto" ? "Original" : `${size}px`}
            </Button>
          ))}
        </div>
      )}

      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        style={{
          width: node.attrs.width === "auto" ? "auto" : `${node.attrs.width}px`,
          display: "block",
          cursor: "pointer",
        }}
        className="rounded mx-auto"
      />
    </NodeViewWrapper>
  );
};

export default ImageWithToolbar;
