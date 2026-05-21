import { useEffect, useRef } from "react";

const BlogContentRenderer = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const blocks = container.querySelectorAll("pre");
    const cleanups = [];

    blocks.forEach((pre) => {
      if (pre.querySelector(".copy-code-btn")) return;

      pre.style.position = "relative";

      const button = document.createElement("button");
      button.textContent = "Copy";
      button.className = "copy-code-btn";
      button.setAttribute("aria-label", "Copy code");
      Object.assign(button.style, {
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "3px 10px",
        fontSize: "12px",
        fontFamily: "inherit",
        borderRadius: "6px",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.1)",
        color: "#e2e8f0",
        cursor: "pointer",
        opacity: "0",
        transition: "opacity 0.15s",
        zIndex: "10",
      });

      let timeout = null;

      const handleClick = async () => {
        const code = pre.querySelector("code");
        const text = code ? code.innerText : pre.innerText;
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = "Copied!";
          button.style.background = "rgba(34,197,94,0.25)";
          button.style.borderColor = "rgba(34,197,94,0.5)";
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            button.textContent = "Copy";
            button.style.background = "rgba(255,255,255,0.1)";
            button.style.borderColor = "rgba(255,255,255,0.2)";
          }, 2000);
        } catch {
          button.textContent = "Failed";
          timeout = setTimeout(() => {
            button.textContent = "Copy";
          }, 2000);
        }
      };

      const showBtn = () => (button.style.opacity = "1");
      const hideBtn = () => (button.style.opacity = "0");

      button.addEventListener("click", handleClick);
      pre.addEventListener("mouseenter", showBtn);
      pre.addEventListener("mouseleave", hideBtn);
      pre.appendChild(button);

      cleanups.push(() => {
        clearTimeout(timeout);
        button.removeEventListener("click", handleClick);
        pre.removeEventListener("mouseenter", showBtn);
        pre.removeEventListener("mouseleave", hideBtn);
        button.remove();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [content]);

  if (!content) return <p>No content available.</p>;

  return (
    <div
      ref={containerRef}
      className="
        prose prose-lg dark:prose-invert tiptap mx-auto max-w-none
        [&_img]:my-6
        [&_img]:rounded-2xl
        [&_img]:shadow-sm
        [&_img[data-align='left']]:mr-auto
        [&_img[data-align='left']]:ml-0
        [&_img[data-align='center']]:mx-auto
        [&_img[data-align='right']]:ml-auto
        [&_img[data-align='right']]:mr-0
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContentRenderer;
