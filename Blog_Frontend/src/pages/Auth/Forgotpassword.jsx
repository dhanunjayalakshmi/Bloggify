import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";

const Forgotpassword = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-gray-900 p-4">
      <ThemeToggle />
      <Card className="w-full max-w-md p-6 shadow-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Reset Password
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
          Enter your email to recieve a reset link
        </p>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <Button className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
            Send Reset Link
          </Button>
          <p className="text-center text-sm mt-4 text-gray-900 dark:text-gray-100">
            <Link to="/login" className="text-blue-500 dark:text-blue-400">
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Forgotpassword;
