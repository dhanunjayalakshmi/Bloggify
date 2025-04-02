import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "dark" ? "light" : "dark";
          document.documentElement.classList.toggle(
            "dark",
            newTheme === "dark"
          );
          return { theme: newTheme };
        }),
    }),
    {
      name: "theme-storage", // Local storage key
    }
  )
);

export default useThemeStore;
