import { useModalStore } from "@/stores/modalStore";
import { Button } from "../ui/button";

const formatNumber = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

const HeroSection = ({ stats }) => {
  const { openModal } = useModalStore();

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
          onClick={() => openModal("login")}
        >
          Explore Blogs
        </Button>
      </div>

      {stats && (
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <span>
            <span className="text-gray-900 dark:text-white font-semibold text-base">
              {formatNumber(stats.blogCount)}
            </span>{" "}
            blogs published
          </span>
          <span className="hidden sm:block text-gray-300 dark:text-gray-600">|</span>
          <span>
            <span className="text-gray-900 dark:text-white font-semibold text-base">
              {formatNumber(stats.userCount)}
            </span>{" "}
            writers
          </span>
          <span className="hidden sm:block text-gray-300 dark:text-gray-600">|</span>
          <span>
            <span className="text-gray-900 dark:text-white font-semibold text-base">
              {formatNumber(stats.totalViews)}
            </span>{" "}
            total reads
          </span>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
