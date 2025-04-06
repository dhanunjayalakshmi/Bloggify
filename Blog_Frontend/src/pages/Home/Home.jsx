import BlogList from "@/components/blogs/BlogList";

const Home = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pt-4">
      <div className="lg:col-span-2 space-y-4">
        <BlogList />
      </div>

      <aside className="sapce-y-4 hidden lg:block">
        <div className="bg-muted rounded-xl p-4">Suggestions</div>
        <div className="bg-muted rounded-xl p-4">Bookmarked</div>
        <div className="bg-muted rounded-xl p-4">Profile Suggestions</div>
      </aside>
    </div>
  );
};

export default Home;
