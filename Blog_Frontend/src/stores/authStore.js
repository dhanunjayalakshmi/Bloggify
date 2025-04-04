import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (userData, token) => set({ user: userData, token }),
      logoutUser: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      getStorage: () => sessionStorage,
    }
  )
);
