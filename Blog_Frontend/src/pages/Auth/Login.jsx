import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";

const schema = z.object({
  email: z.string().email("Email address must not empty"),
  password: z.string("password", { message: "Password must not empty" }),
});

const Login = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state?.user);

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (formData) => {
    try {
      const { data: userData, error } = await supabase.auth.signInWithPassword({
        email: formData?.email,
        password: formData?.password,
      });
      if (error) throw error;

      const { user, session } = userData;

      setUser(user, session?.access_token);

      const res = await api.get(`/users/${user?.id}`);

      const profile = res.data;

      const isProfileIncomplete =
        !profile?.name || profile.name === "New User" || !profile?.bio;

      if (isProfileIncomplete) {
        navigate("/account/edit");
      } else {
        navigate("/");
      }
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message;
      setError("root", { message });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-96 p-6 shadow-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {errors?.root && (
          <p className="text-red-500 dark:text-red-400 text-center text-lg mt-1">
            {errors?.root?.message}
          </p>
        )}
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="new-password"
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-md font-medium text-gray-900 dark:text-gray-100">
                Email Address
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                autoComplete="new-password"
                className="dark:bg-gray-700 dark:text-gray-100"
              />
              {errors?.email && (
                <p className="text-red-500 text-lg mt-1">
                  {errors?.email?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-md font-medium text-gray-900 dark:text-gray-100">
                Password
              </label>
              <Input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                className="dark:bg-gray-700 dark:text-gray-100"
              />
              {errors?.password && (
                <p className="text-red-500 text-lg mt-1">
                  {errors?.password?.message}
                </p>
              )}
            </div>
            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-500 dark:text-blue-400"
              >
                Forgot Password
              </Link>
            </div>
            <Button className="w-full">Login</Button>
          </form>

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
          <p className="text-center text-md mt-4 text-gray-900 dark:text-gray-100">
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
