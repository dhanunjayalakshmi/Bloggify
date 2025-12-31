import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import useThemeStore from "@/stores/themeStore";
// import { toast } from "sonner";
import { useNavigate } from "react-router";

const useAuthInit = () => {
  const setUser = useAuthStore((store) => store?.setUser);
  const setProfile = useAuthStore((store) => store?.setProfile);
  const user = useAuthStore((store) => store?.user);
  const token = useAuthStore((store) => store?.token);
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const isManualLogout = useAuthStore((state) => state?.isManualLogout);
  const setManualLogout = useAuthStore((state) => state?.setManualLogout);

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session?.user, session?.access_token);
      } else {
        setUser(null, null);
      }
    };

    initSession();
  }, [setUser]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          setUser(null, null);
          // if (!isManualLogout) {
          //   toast.success("You are logged out. Please log in again.");
          // }
          setManualLogout(false);
          navigate("/", { replace: true });
        } else {
          setUser(session?.user, session?.access_token);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [setUser, isManualLogout, setManualLogout, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !token) return;

        const res = await api.get(`/users/${user?.id}`);

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

  useEffect(() => {
    setTheme(theme);
  }, [theme]);
};

export default useAuthInit;
