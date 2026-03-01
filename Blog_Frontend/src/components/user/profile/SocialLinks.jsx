// const SocialLinks = ({ links }) => {
//   return (
//     <div className="flex justify-center flex-wrap gap-4 mt-4">
//       {links.website && (
//         <a
//           href={links.website}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:border-b-1 hover:border-orange-500 text-orange-600 dark:text-orange-400"
//         >
//           Website 🌐
//         </a>
//       )}
//       {links.github && (
//         <a
//           href={links.github}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:border-b-1 hover:border-orange-600 text-orange-600 dark:text-orange-400"
//         >
//           GitHub 💻
//         </a>
//       )}
//       {links.linkedin && (
//         <a
//           href={links.linkedin}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:border-b-1 hover:border-orange-600 text-orange-600 dark:text-orange-400"
//         >
//           LinkedIn 🔗
//         </a>
//       )}
//       {links.twitter && (
//         <a
//           href={links.twitter}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:border-b-1 hover:border-orange-600 text-orange-600 dark:text-orange-400"
//         >
//           Twitter 🐦
//         </a>
//       )}
//     </div>
//   );
// };

const SocialLinks = ({ links = {} }) => {
  if (!links) return null;

  const standardLinks = Object?.entries(links)?.filter(
    ([key, value]) =>
      key !== "other" &&
      value &&
      typeof value === "string" &&
      value.trim() !== "",
  );

  const otherLinks = Array?.isArray(links?.other)
    ? links?.other?.filter((item) => item?.label && item?.url)
    : [];

  if (!standardLinks?.length && !otherLinks?.length) return null;

  return (
    <div className="flex justify-center flex-wrap gap-4 mt-4">
      {standardLinks?.map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:border-b border-orange-500 text-orange-600 dark:text-orange-400 text-sm"
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </a>
      ))}

      {otherLinks?.map((item, index) => (
        <a
          key={`${item.label}-${index}`}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:border-b border-orange-500 text-orange-600 dark:text-orange-400 text-sm"
        >
          {item?.label}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
