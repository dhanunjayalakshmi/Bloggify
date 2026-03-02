import BlogList from "@/components/blogs/BlogList";
import { useParams } from "react-router";

const Explore = () => {
  const { tag } = useParams();
  return (
    <div className="w-3/4 mx-auto px-4 pt-4">
      <BlogList tag={tag} />
    </div>
  );
};

export default Explore;
