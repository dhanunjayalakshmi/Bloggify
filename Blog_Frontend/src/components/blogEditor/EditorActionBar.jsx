import { Button } from "@/components/ui/button";

const EditorActionBar = ({
  saving,
  autosaveStatus,
  dirty,
  isEditMode,
  isPublishedBlog,
  onPreview,
  onSaveDraft,
  onPublish,
}) => {
  return (
    <div className="sticky bottom-3 z-40 mt-6 px-3 md:bottom-4 md:px-4">
      <div className="mx-auto my-4 flex max-w-5xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:justify-between md:px-4">
        <p className="text-xs leading-5 text-slate-500 dark:text-slate-300">
          {saving
            ? "Saving blog..."
            : autosaveStatus === "saving"
              ? "Autosaving draft..."
              : autosaveStatus === "saved"
                ? "Draft saved locally"
                : dirty
                  ? "Unsaved local changes"
                  : "All changes are local until you save"}
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:flex md:flex-wrap md:items-center">
          <Button variant="outline" onClick={onPreview} disabled={saving}>
            Preview
          </Button>

          <Button variant="outline" onClick={onSaveDraft} disabled={saving}>
            {saving ? "Saving..." : isEditMode ? "Update Draft" : "Save Draft"}
          </Button>

          <Button onClick={onPublish} disabled={saving}>
            {saving
              ? "Saving..."
              : isEditMode
                ? isPublishedBlog
                  ? "Update Published Blog"
                  : "Publish Blog"
                : "Save & Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorActionBar;
