import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import AuthModal from "./components/AuthModal";
import useThemeInit from "./hooks/useThemeInit";
import useAuthInit from "./hooks/useAuthInit";
import { useBookmarkStore } from "./stores/bookmarksStore";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  useThemeInit();
  useAuthInit();
  const fetchBookmarks = useBookmarkStore((store) => store?.fetchBookmarks);
  const isInitialized = useAuthStore((state) => state?.isInitialized);
  const user = useAuthStore((state) => state?.user);

  useEffect(() => {
    if (isInitialized && user) {
      fetchBookmarks();
    }
  }, [isInitialized, user, fetchBookmarks]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
        <AuthModal />
      </BrowserRouter>
      <Toaster richColors position="bottom-right" closeButton theme="system" />
    </ErrorBoundary>
  );
}

export default App;
