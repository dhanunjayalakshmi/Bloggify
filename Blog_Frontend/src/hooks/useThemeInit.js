import { useEffect } from "react";
import useThemeStore from "@/stores/themeStore";

const useThemeInit = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);
};

export default useThemeInit;
