import MiniBlogCard from "./MiniBlogCard";

const Suggestions = () => {
  const blog = {
    sideHeading: "Suggestions",
    title: "Mini Blog Title",
    author: "Author",
    date: "Date",
    altName: "Suggestions",
  };
  return <MiniBlogCard blog={blog} />;
};

export default Suggestions;
