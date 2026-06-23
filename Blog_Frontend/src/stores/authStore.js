import { supabase } from "@/lib/supabaseClient";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      profile: null,
      isManualLogout: false,
      isInitialized: false,

      setUser: (user, token) => set({ user, token, isInitialized: true }),
      setProfile: (profileUpdater) =>
        set((state) => ({
          profile:
            typeof profileUpdater === "function"
              ? profileUpdater(state?.profile)
              : profileUpdater,
        })),
      clearAuth: () =>
        set({ user: null, token: null, profile: null, isInitialized: true }),
      setManualLogout: (val) => set({ isManualLogout: val }),
      logout: async () => {
        const token = get().token;
        if (token) {
          await fetch(`${import.meta.env.VITE_API_BASE_URL || "/api"}/users/me/ping`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            keepalive: true,
          }).catch(() => {});
        }
        await supabase.auth.signOut();
        set({
          user: null,
          token: null,
          profile: null,
          isManualLogout: true,
          isInitialized: true,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state?.user,
        token: state?.token,
        profile: state?.profile,
        isManualLogout: state?.isManualLogout,
      }),
    },
  ),
);
