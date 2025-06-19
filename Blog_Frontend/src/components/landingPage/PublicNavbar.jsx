import { Button } from "../ui/button";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
import { useModalStore } from "@/stores/modalStore";

const PublicNavbar = () => {
  const { openModal } = useModalStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow px-4 py-4 flex items-center justify-between">
      <Logo />

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Button
          variant="ghost"
          className="text-sm font-medium"
          onClick={() => openModal("login")}
        >
          Login
        </Button>

        <Button
          className="text-sm font-medium"
          onClick={() => openModal("signup")}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default PublicNavbar;
