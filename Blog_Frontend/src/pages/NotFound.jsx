import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

const NotFound = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state?.user);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-extrabold tracking-tight text-orange-500">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 text-muted-foreground max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        className="mt-8"
        onClick={() => navigate(user ? "/home" : "/")}
      >
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
