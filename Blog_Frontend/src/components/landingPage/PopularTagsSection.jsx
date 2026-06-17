import { useNavigate } from "react-router-dom";

const TAG_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
];

const PopularTagsSection = ({ tags = [] }) => {
  const navigate = useNavigate();

  if (!tags.length) return null;

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Explore Popular Topics
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Find blogs on the topics that matter to you
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map(({ tag, count }, idx) => (
          <button
            key={tag}
            onClick={() => navigate(`/tags/${tag}`)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition hover:scale-105 ${TAG_COLORS[idx % TAG_COLORS.length]}`}
          >
            #{tag}
            <span className="ml-2 opacity-60 text-xs">{count}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default PopularTagsSection;
