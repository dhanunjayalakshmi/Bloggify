// src/hooks/useAuthInit.js
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore"; // corrected path
import api from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";

const useAuthInit = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setProfile = useAuthStore((s) => s.setProfile);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user, session.access_token);
      } else {
        setUser(null, null);
      }
    };

    initSession();
  }, [setUser]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !token) return;

        const res = await api.get(`/users/${user.id}`);

        const profile = res?.data;
        if (profile) {
          setProfile(profile);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchProfile();
  }, [user, token, setProfile]);
};

export default useAuthInit;
