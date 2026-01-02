import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      profile: null,
      isManualLogout: false,
      isInitialized: false,

      setUser: (user, token) => set({ user, token, isInitialized: true }),
      setProfile: (profile) => set({ profile }),
      clearAuth: () =>
        set({ user: null, token: null, profile: null, isInitialized: true }),
      setManualLogout: (val) => set({ isManualLogout: val }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
