import BlogPreviewSection from "@/components/landingPage/BlogPreviewSection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import Footer from "@/components/landingPage/Footer";
import HeroSection from "@/components/landingPage/HeroSection";
import PublicNavbar from "@/components/landingPage/PublicNavbar";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const user = useAuthStore((state) => state?.user);
  const token = useAuthStore((state) => state?.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      navigate("/home");
    }
  }, [user, token]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
      <PublicNavbar />
      <HeroSection />
      <FeaturesSection />
      <BlogPreviewSection />
    </div>
  );
};

export default LandingPage;
