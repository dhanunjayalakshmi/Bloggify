import MiniBlogList from "@/components/blogs/MiniBlogList";
import useSidebarBookmarks from "@/hooks/useSidebarBookmarks";

const BookmarkedArticles = () => {
  const { blogs, hasBookmarks } = useSidebarBookmarks(5);

  if (!hasBookmarks) return null;

  return (
    <MiniBlogList
      title="Your Bookmarks"
      blogs={blogs}
      seeMorePath="/profile/bookmarks"
      fullWidth={true}
    />
  );
};

export default BookmarkedArticles;
