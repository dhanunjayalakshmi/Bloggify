import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900 px-4 relative">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Logo />
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
