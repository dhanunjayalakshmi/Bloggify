import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopAuthorsSection = ({ authors = [] }) => {
  const navigate = useNavigate();

  if (!authors.length) return null;

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">
        Top Authors
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {authors.map((author) => (
          <div
            key={author.id}
            onClick={() => navigate(`/users/${author.id}`)}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary transition"
          >
            <img
              src={
                author.avatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
              }
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover mb-3"
            />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {author.name}
            </h3>
            {author.bio && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {author.bio}
              </p>
            )}
            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{author.followers_count ?? 0} followers</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopAuthorsSection;
