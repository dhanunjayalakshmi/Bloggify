import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { X, Hash } from "lucide-react";
import { getTagSuggestions } from "@/services/tagService";

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;

const TagInput = ({ selectedTags, setSelectedTags }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      const result = await getTagSuggestions(query);
      const filtered = result.filter(
        (tag) =>
          !selectedTags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      );
      setSuggestions(filtered);
      setHighlightedIndex(-1);
      setLoading(false);
    }, 300),
    [selectedTags]
  );

  useEffect(() => {
    fetchSuggestions(inputValue);
  }, [inputValue, fetchSuggestions]);

  // ✅ Tag validation & normalization
  const isValidTag = (tag) =>
    tag &&
    tag.length <= MAX_TAG_LENGTH &&
    !/^\d+$/.test(tag) &&
    /^[a-zA-Z0-9\s\-.#+]+$/.test(tag);

  const normalizeTag = (tag) =>
    tag.trim().toLowerCase().replace(/\s+/g, " ").replace(/^#/, "");

  const addTag = (tag) => {
    if (selectedTags.length >= MAX_TAGS || !isValidTag(tag)) return;
    const normalized = normalizeTag(tag);
    if (!selectedTags.some((t) => normalizeTag(t) === normalized)) {
      const formatted =
        normalized.charAt(0).toUpperCase() + normalized.slice(1);
      setSelectedTags([...selectedTags, formatted]);
    }
    setInputValue("");
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addTag(suggestions[highlightedIndex]);
      } else {
        addTag(inputValue);
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    }
    if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightedIndex(-1);
    }
    if (e.key === "Backspace" && !inputValue && selectedTags.length) {
      setSelectedTags(selectedTags.slice(0, -1));
    }
    if (e.key === "Tab" && highlightedIndex >= 0) {
      e.preventDefault();
      addTag(suggestions[highlightedIndex]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const isDisabled = selectedTags.length >= MAX_TAGS;
  const remainingTags = MAX_TAGS - selectedTags.length;

  return (
    <div className="space-y-4 mt-2">
      <Label htmlFor="tagInput" className="text-base font-medium flex gap-2">
        Tags ({selectedTags.length}/{MAX_TAGS})
      </Label>

      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
            >
              <Hash size={12} />
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
              >
                <X size={12} />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input & suggestions */}
      <div className="relative">
        <Input
          ref={inputRef}
          id="tagInput"
          type="text"
          value={inputValue}
          disabled={isDisabled}
          placeholder={
            isDisabled
              ? `Tag limit reached (${MAX_TAGS})`
              : remainingTags === 1
              ? "Add 1 more tag..."
              : `Add up to ${remainingTags} more tags...`
          }
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          maxLength={MAX_TAG_LENGTH}
          className={`text-base ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          } ${
            inputValue && !isValidTag(inputValue)
              ? "border-red-300 dark:border-red-600"
              : ""
          }`}
        />

        {loading && (
          <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-3 text-gray-500 text-sm">
            Loading suggestions...
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addTag(s)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 ${
                  i === highlightedIndex
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                <Hash size={12} className="opacity-50" /> {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {isDisabled && (
        <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
          ⚠️ You've reached the maximum of {MAX_TAGS} tags
        </p>
      )}
    </div>
  );
};

export default TagInput;
