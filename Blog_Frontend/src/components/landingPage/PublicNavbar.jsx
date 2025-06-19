import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";

const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow px-4 py-4 flex items-center justify-between">
      <Logo />

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Button
          variant="ghost"
          className="text-sm font-medium"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>

        <Button
          className="text-sm font-medium"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default PublicNavbar;
