import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";
import Logo from "./Logo";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Bell, Pencil, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabaseClient";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state?.logoutUser);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      logout();
      navigate("/login");
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow px-4 py-4 flex items-center justify-around">
      <Logo />
      <div className="hidden md:block w-1/3">
        <Input type="text" placeholder="Search" className="dark:bg-gray-700" />
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="hidden md:flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/create")}
        >
          <Pencil className="w-4 h-4" /> Write
        </Button>
        <Button
          variant="outline"
          className="hidden md:flex items-center gap-2 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <User className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-gray-900 ">
            <DropdownMenuItem
              onClick={() => navigate("/user/1")}
              className="dark:hover:bg-gray-800"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/")}
              className="dark:hover:bg-gray-800"
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="dark:hover:bg-gray-800"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
