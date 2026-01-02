import Footer from "@/components/landingPage/Footer";
import Navbar from "@/components/Navbar";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useUserProfile from "@/hooks/useUserProfile";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  useAuthRedirect();
  useUserProfile();

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 pt-16 px-4 md:px-8 max-w-screen-xl w-full mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
