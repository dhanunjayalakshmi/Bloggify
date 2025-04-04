import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";

function App() {
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
