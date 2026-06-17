import { Pencil, Search, Bell, Bookmark, Tag, BookOpen } from "lucide-react";

const features = [
  {
    icon: <Pencil className="w-8 h-8 text-primary" />,
    title: "Write Freely",
    description:
      "Rich text editor with formatting, images, code blocks, and cover photos.",
  },
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: "Explore Ideas",
    description:
      "Discover content across tags, authors, and a personalised For You feed.",
  },
  {
    icon: <Tag className="w-8 h-8 text-primary" />,
    title: "Follow Tags",
    description:
      "Follow topics you care about and get a curated feed of matching blogs.",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: "Blog Series",
    description:
      "Group related posts into ordered series so readers never lose their place.",
  },
  {
    icon: <Bell className="w-8 h-8 text-primary" />,
    title: "Notifications",
    description:
      "Real-time alerts for new followers, comments, and reactions on your posts.",
  },
  {
    icon: <Bookmark className="w-8 h-8 text-primary" />,
    title: "Save What You Love",
    description: "Bookmark blogs and revisit them any time from your profile.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 dark:text-white">
        Everything a Modern Blog Platform Should Have
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
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
