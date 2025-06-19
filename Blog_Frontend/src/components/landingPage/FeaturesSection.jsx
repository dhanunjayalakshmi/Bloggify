import { Pencil, Search, Sparkles, Bookmark } from "lucide-react";

const features = [
  {
    icon: <Pencil className="w-8 h-8 text-primary" />,
    title: "Write Freely",
    description:
      "Create and publish blogs with powerful formatting, media, and tags.",
  },
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: "Explore Ideas",
    description:
      "Discover insightful content across technology, lifestyle, and more.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "AI-Assisted Writing",
    description: "Coming soon: Get AI help to refine your writing style.",
  },
  {
    icon: <Bookmark className="w-8 h-8 text-primary" />,
    title: "Save What You Love",
    description: "Bookmark and organize blogs for easy access later.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 dark:text-white">
        Features That Empower Creators
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center px-4"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
