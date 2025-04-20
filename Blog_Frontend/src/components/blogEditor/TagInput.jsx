import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

const mockSuggestions = [
  "JavaScript",
  "React",
  "React Native",
  "Node.js",
  "CSS",
  "Tailwind",
];

const MAX_TAGS = 5;

const TagInput = ({ selectedTags, setSelectedTags }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() !== "") {
      const matches = mockSuggestions.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setFilteredSuggestions(matches);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleAddTag = (tag) => {
    if (selectedTags.length >= MAX_TAGS) return;

    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setInputValue("");
    setFilteredSuggestions([]);
  };

  const handlekeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {selectedTags?.map((tag, index) => (
          <Badge
            variant="secondary"
            key={index}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 dark:text-white"
          >
            {tag}
            <Button
              variant="icon"
              className="hover:text-gray-400"
              onClick={() => handleRemoveTag(tag)}
              aria-label="Remove tag"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <div className="relative space-y-2">
        <Label htmlFor="tagInput" className="text-base font-medium">
          Tags
        </Label>
        <Input
          type="text"
          className={`${
            selectedTags.length >= MAX_TAGS
              ? "opacity-50 cursor-not-allowed"
              : ""
          } text-lg bg-white dark:bg-gray-800 border-1 border-gray-300 shadow-sm hover:shadow-md dark:border-none`}
          placeholder={
            selectedTags.length >= MAX_TAGS
              ? `Tag limit reached (${MAX_TAGS})`
              : "Type and press Enter to add tags..."
          }
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handlekeyDown}
        />

        {filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 bg-white shadow">
            {filteredSuggestions?.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => handleAddTag(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        {inputValue && filteredSuggestions.length === 0 && (
          <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow px-4 py-2 text-gray-600">
            Press <b>Enter</b> to add{" "}
            <span className="text-blue-600">"{inputValue}"</span> as a new tag.
          </div>
        )}
      </div>
      <div className="mt-6">
        <h3 className="font-medium">
          Selected Tags : {selectedTags?.join(", ") || "No tags selected yet."}
        </h3>
      </div>
      {selectedTags.length >= MAX_TAGS && (
        <p className="mt-2 text-sm text-red-500">
          You can only add up to {MAX_TAGS} tags.
        </p>
      )}
    </div>
  );
};

export default TagInput;
