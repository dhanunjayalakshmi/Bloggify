import { useSearchStore } from "@/stores/searchStore";
import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/input";

const NavbarSearch = () => {
  const setSearch = useSearchStore((s) => s.setSearch);
  //   const search = useSearchStore((s) => s.search);

  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    setSearch("");
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder="Search blogs..."
        value={query}
        onChange={handleChange}
        className="dark:bg-gray-700 pr-8"
      />

      {query.length > 0 && (
        <X
          size={16}
          onClick={clearSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
        />
      )}
    </div>
  );
};

export default NavbarSearch;
