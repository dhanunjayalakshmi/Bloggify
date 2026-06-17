import BlogPreviewSection from "@/components/landingPage/BlogPreviewSection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import HeroSection from "@/components/landingPage/HeroSection";
import TopAuthorsSection from "@/components/landingPage/TopAuthorsSection";
import PopularTagsSection from "@/components/landingPage/PopularTagsSection";
import CTASection from "@/components/landingPage/CTASection";
import usePublicStats from "@/hooks/usePublicStats";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const user = useAuthStore((state) => state?.user);
  const token = useAuthStore((state) => state?.token);
  const navigate = useNavigate();
  const { data } = usePublicStats();

  useEffect(() => {
    if (user && token) {
      navigate("/home");
    }
  }, [user, token]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
      <HeroSection stats={data?.stats ?? null} />
      <FeaturesSection />
      <BlogPreviewSection />
      <TopAuthorsSection authors={data?.topAuthors ?? []} />
      <PopularTagsSection tags={data?.popularTags ?? []} />
      <CTASection />
    </div>
  );
};

export default LandingPage;
