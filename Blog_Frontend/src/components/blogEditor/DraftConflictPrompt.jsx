import { Button } from "@/components/ui/button";

const DraftConflictPrompt = ({
  draft,
  mode = "edit",
  onContinue,
  onDiscard,
  onSaveToDb,
}) => {
  const isCreateMode = mode === "create";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow-md space-y-4">
        <h2 className="text-xl font-semibold">You have an unsaved draft</h2>

        <p className="text-sm text-muted-foreground">
          {isCreateMode
            ? "You already have unsaved work in the editor. Do you want to continue it or start a brand new blog?"
            : "You already have unsaved work in the editor. What would you like to do before opening this blog?"}
        </p>

        <div className="rounded-lg bg-muted/40 p-4 text-sm space-y-1">
          <p>
            <span className="font-medium">Title:</span>{" "}
            {draft?.title || "Untitled draft"}
          </p>
          <p>
            <span className="font-medium">Last updated:</span>{" "}
            {draft?.lastUpdated
              ? new Date(draft.lastUpdated).toLocaleString()
              : "Unknown"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onContinue}>
            Continue Draft
          </Button>

          <Button variant="outline" onClick={onDiscard}>
            {isCreateMode ? "Create New" : "Discard Draft and Open Blog"}
          </Button>

          <Button onClick={onSaveToDb}>
            {isCreateMode
              ? "Save Draft to DB and Create New"
              : "Save Draft to DB and Open Blog"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraftConflictPrompt;
