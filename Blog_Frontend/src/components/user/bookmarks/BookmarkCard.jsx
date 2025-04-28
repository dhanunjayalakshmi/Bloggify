import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const BookmarkCard = ({ bookmark, onRemove }) => {
  const { title, author, tags, snippet } = bookmark;

  return (
    <Card className="rounded-2xl my-3 shadow-sm hover:shadow-md transition dark:bg-gray-800 dark:text-gray-200">
      <CardContent className="px-4 py-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-sm text-muted-foreground">By {author}</p>
            <p className="text-sm">{snippet}</p>
            <div className="flex gap-2 flex-wrap text-xs text-muted-foreground mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onRemove}>
            <X size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookmarkCard;
