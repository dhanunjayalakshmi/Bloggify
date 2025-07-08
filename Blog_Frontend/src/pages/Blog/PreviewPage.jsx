import BlogContentRenderer from "@/components/blogEditor/BlogContentRenderer";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";

const PreviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-screen space-y-6">
        <h2 className="text-2xl font-semibold">Invalid Preview</h2>
        <p className="text-muted-foreground">No blog data available.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 min-h-screen flex flex-col space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 text-yellow-700 dark:text-yellow-200 px-4 py-2 text-center text-sm font-medium shadow rounded-lg">
        🛈 This is a preview. Your blog is not yet published.
      </div>

      <div className="w-full flex-grow">
        <BlogContentRenderer
          title={state?.title}
          description={state?.description}
          content={state?.content}
          tags={state?.tags}
        />
      </div>

      <Button
        className="mx-auto block w-1/2 max-w-xs"
        onClick={() => navigate(-1)}
      >
        ← Back to Editor
      </Button>
    </div>
  );
};

export default PreviewPage;
