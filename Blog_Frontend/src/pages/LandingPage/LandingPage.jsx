import AuthModal from "@/components/AuthModal";
import BlogPreviewSection from "@/components/landingPage/BlogPreviewSection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import HeroSection from "@/components/landingPage/HeroSection";
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
      <HeroSection />
      <FeaturesSection />
      <BlogPreviewSection />
    </div>
  );
};

export default LandingPage;
