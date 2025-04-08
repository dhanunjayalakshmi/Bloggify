import React, { useState } from "react";
import { Button } from "./ui/button";

const sortOptions = ["popular", "New", "Trending"];

const SortOptions = () => {
  const [selected, setSelected] = useState("popular");

  return (
    <div className="flex gap-4 mb-4 py-4">
      {sortOptions?.map((option) => (
        <Button
          key={option}
          onClick={() => setSelected(option)}
          className={`tarnsition-all duration-200 ${
            selected === option
              ? "text-white"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-black dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default SortOptions;
