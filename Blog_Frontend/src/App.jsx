import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import useAuthInit from "./hooks/useAuthInit";
import AuthModal from "./components/AuthModal";

function App() {
  useAuthInit();

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
        <AuthModal />
      </BrowserRouter>
      <Toaster richColors position="top-right" closeButton theme="system" />
    </>
  );
}

export default App;
