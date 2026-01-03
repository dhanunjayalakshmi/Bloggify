import BlogList from "@/components/blogs/BlogList";
import BookmarkedArticles from "@/components/sidebar/BookmarkedArticles";
import ProfileSuggestions from "@/components/sidebar/ProfileSuggestions";
import Suggestions from "@/components/sidebar/Suggestions";
import SortOptions from "@/components/SortOptions";
import { useState } from "react";

const Home = () => {
  const [sort, setSort] = useState("popular");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pt-4">
      <div className="lg:col-span-2 space-y-6">
        <SortOptions value={sort} onChange={setSort} />
        <BlogList sort={sort} />
      </div>

      <aside className="hidden lg:block sticky top-12 self-start space-y-4 pt-4">
        <Suggestions />
        <BookmarkedArticles />
        <ProfileSuggestions />
      </aside>
    </div>
  );
};

export default Home;
