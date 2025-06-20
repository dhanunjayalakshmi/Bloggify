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
import { toast } from "sonner";
import { useModalStore } from "@/stores/modalStore";

const signupSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be atleast 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const navigate = useNavigate();
  const { setMode, closeModal } = useModalStore();
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
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (formData) => {
    try {
      const { data: res, error } = await supabase.auth.signUp({
        email: formData?.email,
        password: formData?.password,
      });

      if (error) {
        toast.error(error.message || "Signup failed");
        return;
      }

      const { user, session } = res;

      if (user && session === null && user?.identities?.length === 0) {
        toast.error("This email is already registered. Please log in.");
        closeModal();
        return;
      }

      if (user && session === null) {
        toast.success(
          "Signup successful! Please check your email to confirm your account."
        );
        closeModal();
        return;
      }

      if (user && session) {
        const { access_token } = session;
        setUser(user, access_token);

        closeModal();
        navigate("/home");
      }
    } catch (error) {
      setError("root", { message: error?.message });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Sign Up
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
          Create a new account
        </p>

        {errors?.root && (
          <p className="text-red-500 dark:text-red-400 text-lg mt-1">
            {errors?.root?.message}
          </p>
        )}
        <div className="space-y-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="new-password"
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
                <p className="text-red-500 dark:text-red-400 text-lg mt-1">
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
                placeholder="Create a password"
                autoComplete="new-password"
                className="dark:bg-gray-700 dark:text-gray-100"
              />
              {errors?.password && (
                <p className="text-red-500 dark:text-red-400 text-lg mt-1">
                  {errors?.password?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-md font-medium text-gray-900 dark:text-gray-100">
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
                <p className="text-red-500 dark:text-red-400 text-lg mt-1">
                  {errors?.confirmPassword?.message}
                </p>
              )}
            </div>
            <Button className="w-full">Sign Up</Button>
          </form>
          <p className="text-center text-md mt-4 text-gray-900 dark:text-gray-100">
            Already have an account?{" "}
            <Button
              variant="ghostButton"
              className="text-base"
              onClick={() => setMode("login")}
            >
              Login
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
