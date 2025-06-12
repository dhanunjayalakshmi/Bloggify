import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { useAuthStore } from "./stores/authStore";

function App() {
  const setUser = useAuthStore((state) => state?.setUser);

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
  }, []);

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster richColors position="top-right" closeButton theme="system" />
    </>
  );
}

export default App;
