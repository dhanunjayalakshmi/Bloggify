import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const MAX_LENGTH = 100;

const TitleInput = ({ value, onChange, error }) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  useEffect(() => {
    setCharCount(value?.length || 0);
  }, [value]);
  return (
    <div className="space-y-2">
      <Label htmlFor="title" className="text-base font-medium">
        Title
      </Label>
      <Input
        id="title"
        value={value}
        maxLength={MAX_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your blog title ..."
        className={`text-lg ${error ? "border-red-500" : ""}`}
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

export default TitleInput;
