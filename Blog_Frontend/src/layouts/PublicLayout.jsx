import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Footer from "@/components/landingPage/Footer";
import Navbar from "@/components/Navbar";
import PublicNavbar from "@/components/landingPage/PublicNavbar";

export default function PublicLayout() {
  const user = useAuthStore((state) => state?.user);

  return (
    <>
      {user ? <Navbar /> : <PublicNavbar />}
      <main className="pt-20 min-h-[calc(100vh-80px)] dark:bg-gray-800 text-black dark:text-white">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
