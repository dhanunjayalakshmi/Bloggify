import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
      <Navbar />
      <main className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
