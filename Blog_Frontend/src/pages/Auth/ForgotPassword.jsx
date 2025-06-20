import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });
  const navigate = useNavigate();
  const user = useAuthStore((state) => state?.user);

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const onSubmit = async (formData) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData?.email,
        {
          redirectTo: "http://localhost:5173/update-password",
        }
      );
      if (error) throw error;
    } catch (error) {
      setError("root", { message: error?.message });
    }
  };
  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-md p-6 shadow-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Reset Password
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
          Enter your email to recieve a reset link
        </p>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            auto-complete="new-password"
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Email Address
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                auto-complete="new-password"
                className="dark:bg-gray-700 dark:text-gray-100"
              />
              {errors?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.email?.message}
                </p>
              )}
            </div>
            <Button className="w-full">Send Reset Link</Button>
            {errors?.root && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.root?.message}
              </p>
            )}
          </form>
          <p className="text-center text-sm mt-4 text-gray-900 dark:text-gray-100">
            <Link to="/" className="text-blue-500 dark:text-blue-400">
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
