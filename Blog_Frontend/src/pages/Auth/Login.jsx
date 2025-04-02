import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import { Link } from "react-router";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-gray-900">
      <ThemeToggle />
      <Card className="w-96 p-6 shadow-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center">Login</h2>
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="text-right text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-500 dark:text-blue-400"
            >
              Forgot Password
            </Link>
          </div>
          <Button className="w-full text-lg font-bold text-gray-100 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
            Login
          </Button>
          <div className="text-center text-md text-gray-900 dark:text-gray-100">
            Or Login with
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="rounded-full">
              <Mail />
            </Button>
            <Button variant="outline" className="rounded-full">
              <Lock />
            </Button>
          </div>
          <p className="text-center text-sm mt-4 text-gray-900 dark:text-gray-100">
            Dont have an account ?{" "}
            <Link to="/signup" className="text-blue-500 dark:text-blue-400">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
