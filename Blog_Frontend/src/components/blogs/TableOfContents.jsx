const TableOfContents = ({ headings, activeId }) => {
  if (!headings.length) return null;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="sticky top-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
        On this page
      </p>
      <ul className="space-y-1 border-l border-gray-200 dark:border-gray-700">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
              className={`text-left w-full text-sm leading-snug py-1 pl-3 border-l-2 -ml-px transition-colors cursor-pointer ${
                level === 3 ? "pl-5" : level === 1 ? "pl-2" : "pl-3"
              } ${
                activeId === id
                  ? "border-orange-500 text-orange-500 font-medium"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
