import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabaseClient";

const useAuthInit = () => {
  const setUser = useAuthStore((store) => store?.setUser);
  const clearAuth = useAuthStore((store) => store?.clearAuth);

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session?.user, session?.access_token);
      } else {
        clearAuth();
      }
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session?.user) {
          setUser(session?.user, session?.access_token);
        } else {
          clearAuth();
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
};

export default useAuthInit;
