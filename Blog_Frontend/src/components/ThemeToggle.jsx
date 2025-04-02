import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import useThemeStore from "@/stores/themeStore";
// import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <Button
      variant="outline"
      className="absolute top-4 right-4"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
