import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabaseClient";
import api from "@/lib/apiClient";

const useAuthInit = () => {
  const setUser = useAuthStore((store) => store.setUser);
  const setProfile = useAuthStore((store) => store.setProfile);
  const clearAuth = useAuthStore((store) => store.clearAuth);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          clearAuth();
          return;
        }

        setUser(session.user, session.access_token);

        // Only fetch profile on actual sign-in or initial page load, not on every token refresh
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          try {
            const res = await api.get("/users/me");
            setProfile(res?.data);
          } catch (err) {
            console.error("Failed to fetch profile", err);
          }
        }
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
};

export default useAuthInit;
