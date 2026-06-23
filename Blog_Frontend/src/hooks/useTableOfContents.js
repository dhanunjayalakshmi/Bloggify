import { useEffect, useState } from "react";

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const useTableOfContents = (content, containerId = "blog-content") => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  // Extract headings and inject IDs into the DOM
  useEffect(() => {
    if (!content) return;

    const timeout = setTimeout(() => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const els = container.querySelectorAll("h1, h2, h3");
      const items = [];

      els.forEach((el) => {
        const base = slugify(el.textContent) || `heading-${items.length}`;
        const duplicates = items.filter(
          (h) => h.id === base || h.id.startsWith(base + "-")
        ).length;
        const id = duplicates > 0 ? `${base}-${duplicates}` : base;
        el.id = id;
        items.push({ id, text: el.textContent, level: parseInt(el.tagName[1]) });
      });

      setHeadings(items);
      if (items.length) setActiveId(items[0].id);
    }, 150);

    return () => clearTimeout(timeout);
  }, [content, containerId]);

  // Track active heading with IntersectionObserver
  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-10% 0% -75% 0%", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return { headings, activeId };
};

export default useTableOfContents;
