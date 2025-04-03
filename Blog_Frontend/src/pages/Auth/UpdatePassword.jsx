import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

const updatePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be atleast 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const UpdatePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(updatePasswordSchema) });
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: formData?.password,
      });

      if (error) throw error;
      console.log(data);
      navigate("/login");
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-gray-900 p-4">
      <ThemeToggle />
      <Card className="w-full max-w-md p-6 shadow-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Update Password
        </h2>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="new-password"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Password
              </label>
              <Input
                {...register("password")}
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                className="dark:bg-gray-700 dark:text-gray-100"
              />
              {errors?.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.password?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Confirm Password
              </label>
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                className="dark:bg-gray-700 dark:text-gray-100"
              />
              {errors?.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.confirmPassword?.message}
                </p>
              )}
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
              Sign Up
            </Button>
          </form>
          <p className="text-center text-sm mt-4 text-gray-900 dark:text-gray-100">
            Or{" "}
            <Link to="/login" className="text-blue-500 dark:text-blue-400">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;
