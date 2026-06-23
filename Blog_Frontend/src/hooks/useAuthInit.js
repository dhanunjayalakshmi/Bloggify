import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabaseClient";
import api from "@/lib/apiClient";

const sendPing = () => {
  const token = useAuthStore.getState().token;
  if (!token) return;
  fetch(`${import.meta.env.VITE_API_BASE_URL || "/api"}/users/me/ping`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    keepalive: true,
  }).catch(() => {});
};

const useAuthInit = () => {
  const setUser = useAuthStore((store) => store.setUser);
  const setProfile = useAuthStore((store) => store.setProfile);
  const clearAuth = useAuthStore((store) => store.clearAuth);

  useEffect(() => {
    // Update last_active_at when tab is hidden (covers close, navigate away, logout)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendPing();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          clearAuth();
          return;
        }

        setUser(session.user, session.access_token);

        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          try {
            const res = await api.get("/users/me");
            setProfile(res?.data);
          } catch (err) {
            console.error("Failed to fetch profile", err);
          }
          // Record login time as last active
          api.post("/users/me/ping").catch(() => {});
        }
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useAuthInit;
