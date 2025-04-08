import MiniBlogCard from "./MiniBlogCard";

const BookmarkedArticles = () => {
  const blog = {
    sideHeading: "Bookmarks",
    title: "Mini Blog Title",
    author: "Author",
    date: "Date",
    altName: "bookmarks",
  };
  return <MiniBlogCard blog={blog} />;
};

export default BookmarkedArticles;
