import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      useAuthStore.getState().logoutUser();
      navigate("/login");
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-gray-900">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Logo />
        <span className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">
          Blogging
        </span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle />
        <Button className="" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="max-w-xl p-6 text-xl font-bold">Home Page</div>
    </div>
  );
};

export default Home;
