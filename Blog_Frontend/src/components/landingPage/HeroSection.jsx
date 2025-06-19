import { useModalStore } from "@/stores/modalStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

const HeroSection = () => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-28">
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl text-gray-900 dark:text-white">
        Discover, Write, and Share Your Thoughts
      </h1>
      <p className="mt-4 text-lg md:text-xl max-w-xl text-gray-600 dark:text-gray-300">
        A modern blogging platform for creators, thinkers, and storytellers.
      </p>
      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        <Button
          className="px-6 py-2 text-base"
          onClick={() => openModal("login")}
        >
          Get Started
        </Button>
        <Button
          variant="outline"
          className="px-6 py-2 text-base"
          onClick={() => navigate("/home")}
        >
          Explore Blogs
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
