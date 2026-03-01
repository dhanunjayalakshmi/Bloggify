import {
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Link as LinkIcon,
} from "lucide-react";

const iconMap = {
  website: Globe,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
};

const SocialLinks = ({ links = {} }) => {
  if (!links) return null;

  const standardLinks = Object.entries(links).filter(
    ([key, value]) =>
      key !== "other" &&
      value &&
      typeof value === "string" &&
      value.trim() !== "",
  );

  const otherLinks = Array.isArray(links.other)
    ? links.other.filter((item) => item?.label && item?.url)
    : [];

  if (!standardLinks?.length && !otherLinks?.length) return null;

  return (
    <div className="flex justify-center flex-wrap gap-4 mt-4">
      {standardLinks.map(([key, url]) => {
        const Icon = iconMap[key] || LinkIcon;

        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:opacity-80 transition text-md"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <Icon size={16} className="text-blue-500" />
          </a>
        );
      })}

      {otherLinks.map((item, index) => (
        <a
          key={`${item?.label}-${index}`}
          href={item?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:opacity-80 transition text-md"
        >
          {item?.label}
          <LinkIcon size={16} className="text-blue-500" />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
