import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import useThemeStore from "@/stores/themeStore";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button variant="outline" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
