import { Button } from "./ui/button";

const sortOptions = ["Latest", "Popular", "Trending", "For You"];

const SortOptions = ({ value, onChange }) => {
  return (
    <div className="flex gap-4 mb-4 py-4">
      {sortOptions?.map((option) => (
        <Button
          key={option}
          onClick={() => onChange(option)}
          className={`transition-all duration-200 ${
            value === option
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
