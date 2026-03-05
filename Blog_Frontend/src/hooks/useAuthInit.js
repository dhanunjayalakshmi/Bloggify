import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabaseClient";
import api from "@/lib/apiClient";

const useAuthInit = () => {
  const setUser = useAuthStore((store) => store.setUser);
  const setProfile = useAuthStore((store) => store.setProfile);
  const clearAuth = useAuthStore((store) => store.clearAuth);

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user, session.access_token);

        try {
          const res = await api.get("/users/me");
          setProfile(res?.data);
        } catch (err) {
          console.error("Failed to fetch profile", err);
        }
      } else {
        clearAuth();
      }
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          setUser(session.user, session.access_token);

          try {
            const res = await api.get("/users/me");
            setProfile(res.data);
          } catch (err) {
            console.error("Failed to fetch profile", err);
          }
        } else {
          clearAuth();
        }
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
};

export default useAuthInit;
