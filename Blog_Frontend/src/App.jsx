import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import AuthModal from "./components/AuthModal";
import useThemeInit from "./hooks/useThemeInit";
import useAuthInit from "./hooks/useAuthInit";
import { useBookmarkStore } from "./stores/bookmarksStore";
import { useEffect } from "react";

function App() {
  useThemeInit();
  useAuthInit();
  const fetchBookmarks = useBookmarkStore((store) => store?.fetchBookmarks);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
        <AuthModal />
      </BrowserRouter>
      <Toaster richColors position="bottom-right" closeButton theme="system" />
    </>
  );
}

export default App;
