import BlogList from "@/components/blogs/BlogList";
import ForYouFeed from "@/components/blogs/ForYouFeed";
import BookmarkedArticles from "@/components/sidebar/BookmarkedArticles";
import ProfileSuggestions from "@/components/sidebar/ProfileSuggestions";
import Suggestions from "@/components/sidebar/Suggestions";
import SortOptions from "@/components/SortOptions";
import { useSearchStore } from "@/stores/searchStore";
import { useEffect, useState } from "react";

const Home = () => {
  const globalSearch = useSearchStore((state) => state.search);

  const [debouncedSearch, setDebouncedSearch] = useState(globalSearch);
  const [sort, setSort] = useState("Latest");

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(globalSearch);
    }, 600);

    return () => clearTimeout(id);
  }, [globalSearch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pt-4">
      <div className="lg:col-span-2 space-y-6">
        <SortOptions value={sort} onChange={setSort} />
        {sort === "For You" ? (
          <ForYouFeed />
        ) : (
          <>
            {debouncedSearch && (
              <p className="text-sm text-muted-foreground">
                Results for "{debouncedSearch}"
              </p>
            )}
            <BlogList sort={sort} search={debouncedSearch} tag="All Tags" />
          </>
        )}
      </div>

      <aside className="hidden lg:block sticky top-12 self-start space-y-4 my-4">
        <Suggestions />
        <BookmarkedArticles />
        <ProfileSuggestions />
      </aside>
    </div>
  );
};

export default Home;
