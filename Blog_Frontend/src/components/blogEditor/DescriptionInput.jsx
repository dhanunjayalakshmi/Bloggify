import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const MAX_LENGTH = 200;

const DescriptionInput = ({ value, onChange, error }) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  useEffect(() => {
    setCharCount(value?.length || 0);
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor="description" className="text-base font-medium">
        Description
      </Label>
      <Textarea
        id="description"
        value={value}
        maxLength={MAX_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a short summary of your blog (150–200 characters)..."
        className={`resize-none border-1 border-gray-300 text-base shadow-sm hover:shadow-md dark:border-none ${
          error ? "border-red-500" : ""
        }`}
        rows={4}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          {charCount}/{MAX_LENGTH}
          {error && <span className="text-red-500">{error}</span>}
        </span>
      </div>
    </div>
  );
};

export default DescriptionInput;
