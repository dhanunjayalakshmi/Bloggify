import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";

const EditorActionBar = ({
  saving,
  autosaveStatus,
  dirty,
  isEditMode,
  isPublishedBlog,
  scheduledAt,
  onPreview,
  onSaveDraft,
  onPublish,
  onSchedule,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickedDate, setPickedDate] = useState("");

  const minDateTime = new Date(Date.now() + 5 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const handleConfirmSchedule = () => {
    if (!pickedDate) return;
    onSchedule(pickedDate);
    setShowPicker(false);
    setPickedDate("");
  };

  return (
    <div className="sticky bottom-3 z-40 mt-6 px-3 md:bottom-4 md:px-4">
      <div className="mx-auto my-4 flex max-w-5xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:px-4">

        {/* Schedule date picker */}
        {showPicker && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
            <CalendarClock className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="datetime-local"
              min={minDateTime}
              value={pickedDate}
              onChange={(e) => setPickedDate(e.target.value)}
              className="text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleConfirmSchedule} disabled={!pickedDate}>
                Confirm
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowPicker(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-300">
            {saving
              ? "Saving blog..."
              : scheduledAt
                ? `Scheduled for ${new Date(scheduledAt).toLocaleString()}`
                : autosaveStatus === "saving"
                  ? "Autosaving draft..."
                  : autosaveStatus === "saved"
                    ? "Draft saved locally"
                    : dirty
                      ? "Unsaved local changes"
                      : "All changes are local until you save"}
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:flex md:flex-wrap md:items-center">
            <Button variant="outline" onClick={onPreview} disabled={saving}>
              Preview
            </Button>

            <Button variant="outline" onClick={onSaveDraft} disabled={saving}>
              {saving ? "Saving..." : isEditMode ? "Update Draft" : "Save Draft"}
            </Button>

            {!isPublishedBlog && (
              <Button
                variant="outline"
                onClick={() => setShowPicker((p) => !p)}
                disabled={saving}
                className="gap-1"
              >
                <CalendarClock className="h-4 w-4" />
                {scheduledAt ? "Reschedule" : "Schedule"}
              </Button>
            )}

            <Button onClick={onPublish} disabled={saving}>
              {saving
                ? "Saving..."
                : isEditMode
                  ? isPublishedBlog
                    ? "Update Published Blog"
                    : "Publish Now"
                  : "Save & Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorActionBar;
