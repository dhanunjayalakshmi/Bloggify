import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useModalStore } from "@/stores/modalStore";
import SocialAuthButtons from "@/components/SocialAuthButtons";

const schema = z.object({
  email: z.string().email("Email address must not empty"),
  password: z.string("password", { message: "Password must not empty" }),
});

const Login = () => {
  const navigate = useNavigate();
  const { closeModal, setMode } = useModalStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (formData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData?.email,
        password: formData?.password,
      });
      if (error) {
        toast.error(error.message);
        setError("root", { message: error.message });
        return;
      }
      // useAuthInit's onAuthStateChange handles setUser and profile fetch in the background
      closeModal();
      navigate("/home");
    } catch (error) {
      setError("root", {
        message: error?.response?.data?.error || error.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {errors?.root && (
          <p className="text-red-500 dark:text-red-400 text-center text-lg mt-1">
            {errors?.root?.message}
          </p>
        )}
        <div className="space-y-4">
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
              <Button
                variant="ghostButton"
                onClick={() => setMode("forgot")}
                className="text-blue-500 dark:text-blue-400"
              >
                Forgot Password
              </Button>
            </div>
            <Button className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <SocialAuthButtons />
          <p className="text-center text-md mt-4 text-gray-900 dark:text-gray-100">
            Dont have an account ?{" "}
            <Button
              variant="ghostButton"
              className="text-base"
              onClick={() => setMode("signup")}
            >
              Signup
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
