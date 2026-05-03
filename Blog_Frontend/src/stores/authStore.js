import { supabase } from "@/lib/supabaseClient";
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
