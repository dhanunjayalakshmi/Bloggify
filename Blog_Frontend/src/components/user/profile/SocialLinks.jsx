import React from "react";

const SocialLinks = ({ links }) => {
  return (
    <div className="flex justify-center flex-wrap gap-4 mt-4">
      {links.website && (
        <a
          href={links.website}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:border-b-1 hover:border-orange-500 text-orange-600 dark:text-orange-400"
        >
          Website 🌐
        </a>
      )}
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:border-b-1 hover:border-orange-600 text-orange-600 dark:text-orange-400"
        >
          GitHub 💻
        </a>
      )}
      {links.linkedin && (
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:border-b-1 hover:border-orange-600 text-orange-600 dark:text-orange-400"
        >
          LinkedIn 🔗
        </a>
      )}
      {links.twitter && (
        <a
          href={links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:border-b-1 hover:border-orange-600 text-orange-600 dark:text-orange-400"
        >
          Twitter 🐦
        </a>
      )}
    </div>
  );
};

export default SocialLinks;
