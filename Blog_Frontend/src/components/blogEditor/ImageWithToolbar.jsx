import { NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Trash2,
  Maximize2,
  Minimize2,
} from "lucide-react";

const toolbarBtnClass = (active = false) =>
  `h-8 rounded-lg px-2 text-xs transition-colors ${
    active
      ? "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/70"
  }`;

const ImageWithToolbar = ({ node, selected, updateAttributes, deleteNode }) => {
  const imageWidth = node.attrs.width || "auto";
  const imageAlign = node.attrs.align || "center";

  const handleDeleteImage = () => {
    deleteNode();
  };

  const getImageStyle = () => {
    const resolvedWidth = imageWidth === "auto" ? "auto" : `${imageWidth}px`;

    if (imageAlign === "left") {
      return {
        width: resolvedWidth,
        display: "block",
        marginLeft: 0,
        marginRight: "auto",
      };
    }

    if (imageAlign === "right") {
      return {
        width: resolvedWidth,
        display: "block",
        marginLeft: "auto",
        marginRight: 0,
      };
    }

    return {
      width: resolvedWidth,
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    };
  };

  return (
    <NodeViewWrapper className="image-with-toolbar my-6">
      {selected && (
        <div className="mb-3 mx-auto w-fit flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
          <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-900/60">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="400px"
              className={toolbarBtnClass(imageWidth === "400")}
              onClick={() => updateAttributes({ width: "400" })}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="600px"
              className={toolbarBtnClass(imageWidth === "600")}
              onClick={() => updateAttributes({ width: "600" })}
            >
              600
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="780px"
              className={toolbarBtnClass(imageWidth === "780")}
              onClick={() => updateAttributes({ width: "780" })}
            >
              780
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Original size"
              className={toolbarBtnClass(imageWidth === "auto")}
              onClick={() => updateAttributes({ width: "auto" })}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-900/60">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Align left"
              className={toolbarBtnClass(imageAlign === "left")}
              onClick={() => updateAttributes({ align: "left" })}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Align center"
              className={toolbarBtnClass(imageAlign === "center")}
              onClick={() => updateAttributes({ align: "center" })}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Align right"
              className={toolbarBtnClass(imageAlign === "right")}
              onClick={() => updateAttributes({ align: "right" })}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 rounded-lg px-3 text-xs text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
            onClick={handleDeleteImage}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Remove
          </Button>
        </div>
      )}

      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        style={getImageStyle()}
        className="rounded-2xl shadow-sm"
      />
    </NodeViewWrapper>
  );
};

export default ImageWithToolbar;
