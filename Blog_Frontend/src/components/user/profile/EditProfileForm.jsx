import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const FormRow = ({ label, error, children }) => (
  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
    <Label className="text-sm md:text-base mb-1 md:mb-0 md:w-1/4">
      {label}
    </Label>
    <div className="flex-1 flex-col">
      <div className="">{children}</div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  </div>
);

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((val) => (val === "" ? undefined : val))
  .refine((val) => !val || /^https?:\/\/.+/.test(val), "Invalid URL format.");

const ProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  username: z
    .string()
    .min(2)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),
  bio: z.string().max(200, "Bio can't exceed 200 characters.").optional(),
  location: z.string().optional(),
  website: optionalUrl,
  github: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
  instagram: optionalUrl,
  otherSocialLinks: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required."),
        url: z.string().url("Invalid URL."),
      }),
    )
    .optional(),
});

const EditProfileForm = ({ initialData }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: "",
      username: "",
      bio: "",
      location: "",
      website: "",
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      otherSocialLinks: [],
    },
  });

  const setProfile = useAuthStore((store) => store?.setProfile);
  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherSocialLinks",
  });

  useEffect(() => {
    if (!initialData) return;

    reset({
      fullName: initialData.full_name ?? "",
      username: initialData.username ?? "",
      bio: initialData.bio ?? "",
      location: initialData.location ?? "",
      website: initialData.social_links?.website ?? "",
      github: initialData.social_links?.github ?? "",
      linkedin: initialData.social_links?.linkedin ?? "",
      twitter: initialData.social_links?.twitter ?? "",
      instagram: initialData.social_links?.instagram ?? "",
      otherSocialLinks: initialData.social_links?.other ?? [],
    });
  }, [initialData?.id]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        full_name: data?.fullName,
        username: data?.username.trim(),
        bio: data?.bio,
        location: data?.location,
        social_links: {
          website: data?.website || null,
          github: data?.github || null,
          linkedin: data?.linkedin || null,
          twitter: data?.twitter || null,
          instagram: data?.instagram || null,
          other: data?.otherSocialLinks || [],
        },
      };

      const res = await api.put("/users/me", payload);


      // Update global profile store immediately
      if (res?.data?.user) {
        setProfile((prev) => ({
          ...prev,
          full_name: res.data.user.name,
          username: res.data.user.username,
          bio: res.data.user.bio,
          location: res.data.user.location,
          social_links: res.data.user.social_links || {},
        }));
      }

      toast.success("Profile updated successfully!");
      navigate(-1);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to update profile";

      if (message.toLowerCase().includes("username")) {
        toast.error("Username already taken.");
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
        <div className="space-y-6">
          <FormRow label="Full Name" error={errors.fullName?.message}>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="John Doe"
              className="input-compact"
            />
          </FormRow>

          <FormRow label="Username" error={errors.username?.message}>
            <Input
              id="username"
              {...register("username")}
              placeholder="@johndoe"
              className="input-compact"
            />
          </FormRow>

          <FormRow label="Bio" error={errors.bio?.message}>
            <Textarea
              id="bio"
              {...register("bio")}
              placeholder="Tell us a bit about yourself"
              className="input-compact"
            />
          </FormRow>

          <FormRow label="Location" error={errors.location?.message}>
            <Input
              id="location"
              {...register("location")}
              placeholder="City, Country"
              className="input-compact"
            />
          </FormRow>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Social Links</h2>
        <div className="space-y-6">
          <FormRow label="Website" error={errors.website?.message}>
            <Input
              id="website"
              {...register("website")}
              placeholder="https://yourwebsite.com"
              className="input-compact"
            />
          </FormRow>

          <FormRow label="GitHub" error={errors.github?.message}>
            <Input
              id="github"
              {...register("github")}
              placeholder="https://github.com/yourhandle"
              className="input-compact"
            />
          </FormRow>

          <FormRow label="LinkedIn" error={errors.linkedin?.message}>
            <Input
              id="linkedin"
              {...register("linkedin")}
              placeholder="https://linkedin.com/in/yourhandle"
              className="input-compact"
            />
          </FormRow>

          <FormRow label="Twitter" error={errors.twitter?.message}>
            <Input
              id="twitter"
              {...register("twitter")}
              placeholder="https://twitter.com/yourhandle"
              className="input-compact"
            />
          </FormRow>

          <FormRow label="Instagram" error={errors.instagram?.message}>
            <Input
              id="instagram"
              {...register("instagram")}
              placeholder="https://instagram.com/yourhandle"
              className="input-compact"
            />
          </FormRow>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Other Social Links</h2>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-2 md:items-center"
            >
              <Input
                placeholder="Label (e.g., Dribbble)"
                {...register(`otherSocialLinks.${index}.label`)}
                className="input-compact flex-1"
              />
              <Input
                placeholder="https://..."
                {...register(`otherSocialLinks.${index}.url`)}
                className="input-compact flex-1"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
                className="w-1/4 md:w-auto"
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ label: "", url: "" })}
          >
            + Add Link
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-white dark:bg-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle>Discard changes?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white dark:bg-gray-700 hover:dark:bg-gray-800">
                Stay
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate(-1)}>
                Leave
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
