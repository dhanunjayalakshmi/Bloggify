import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const mockSuggestions = ["JavaScript", "React", "Node.js", "CSS", "Tailwind"];

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
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full text-sm flex items-center justify-between"
          >
            {tag}
            <Button
              variant="icon"
              className="hover:text-gray-400"
              onClick={() => handleRemoveTag(tag)}
            >
              x
            </Button>
          </span>
        ))}
      </div>

      <div className="relative space-y-2">
        <Label htmlFor="tagInput" className="text-base font-medium">
          Tags
        </Label>
        <Input
          type="text"
          className="text-lg border-1 border-gray-300 shadow-sm hover:shadow-md dark:border-none"
          placeholder="Type and press enter to add tag..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handlekeyDown}
        />

        {filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow">
            {filteredSuggestions?.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        {inputValue && filteredSuggestions.length === 0 && (
          <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow px-4 py-2 text-gray-600">
            Press <b>Enter</b> to add{" "}
            <span className="text-blue-600">"{inputValue}"</span> as a new tag.
          </div>
        )}
      </div>
      <div className="mt-6">
        {/* <h3 className="font-medium">Selected Tags:</h3> */}
        <p>{selectedTags.join(", ") || "No tags selected yet."}</p>
      </div>
    </div>
  );
};

export default TagInput;
