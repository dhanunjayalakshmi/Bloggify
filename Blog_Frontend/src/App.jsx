import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import AuthModal from "./components/AuthModal";

function App() {
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
