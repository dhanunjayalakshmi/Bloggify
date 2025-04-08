import BlogList from "@/components/blogs/BlogList";
import BookmarkedArticles from "@/components/sidebar/BookmarkedArticles";
import ProfileSuggestions from "@/components/sidebar/ProfileSuggestions";
import Suggestions from "@/components/sidebar/Suggestions";
import SortOptions from "@/components/SortOptions";
import { useEffect, useRef, useState } from "react";

const Home = () => {
  const sidebarEndRef = useRef(null);
  const [isSidebarBottomVisible, setIsSidebarBottomVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSidebarBottomVisible(entry?.isIntersecting);
      },
      {
        root: null,
        threshold: 1.0,
      }
    );
    const currentVal = sidebarEndRef.current;

    if (currentVal) {
      observer.observe(currentVal);
    }

    return () => {
      if (currentVal) {
        observer.unobserve(currentVal);
      }
    };
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pt-4">
      <div className="lg:col-span-2 space-y-6">
        <SortOptions />
        <BlogList />
      </div>

      <aside
        className={`space-y-4 hidden pt-4 lg:block sticky top-12 self-start transition-opacity duration-300 ${
          isSidebarBottomVisible ? "opacity-100" : "opacity-90"
        }`}
      >
        <Suggestions />
        <BookmarkedArticles />
        <ProfileSuggestions />
        <div ref={sidebarEndRef} className="h-1" />
      </aside>
    </div>
  );
};

export default Home;
