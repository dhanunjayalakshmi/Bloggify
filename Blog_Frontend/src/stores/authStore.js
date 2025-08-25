import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      profile: null,
      isManualLogout: false,
      setManualLogout: (val) => set({ isManualLogout: val }),
      setUser: (user, token) => set({ user: user, token }),
      setProfile: (profile) => set({ profile }),
      clearAuth: () =>
        set({ user: null, token: null, profile: null, isManualLogout: true }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
