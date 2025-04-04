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
      <ThemeToggle />
      <Button
        className="absolute top-4 right-20 text-lg font-bold text-gray-100 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
        onClick={handleLogout}
      >
        Logout
      </Button>
      <div className="max-w-xl p-6 text-xl font-bold">Home Page</div>
    </div>
  );
};

export default Home;
