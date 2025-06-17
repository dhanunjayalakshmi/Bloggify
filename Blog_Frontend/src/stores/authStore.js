import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      profile: null,
      setUser: (userData, token) => set({ user: userData, token }),
      setProfile: (profile) => set({ profile }),
      clearAuth: () => set({ user: null, token: null, profile: null }),
    }),
    {
      name: "auth-storage",
      getStorage: () => sessionStorage,
    }
  )
);
