import MiniBlogList from "@/components/blogs/MiniBlogList";
import useLatestBlogs from "@/hooks/useLatestBlogs";

const Suggestions = () => {
  const { blogs } = useLatestBlogs(5);

  return (
    <MiniBlogList
      title="Suggestions"
      blogs={blogs}
      seeMorePath="/explore"
      fullWidth={true}
    />
  );
};

export default Suggestions;
