import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const FormRow = ({ label, error, children }) => (
  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
    <Label className="text-sm md:text-base mb-1 md:mb-0 md:w-1/4">
      {label}
    </Label>
    <div className="flex-1">{children}</div>
    {error && (
      <p className="text-xs text-red-500 mt-1 md:mt-0 md:ml-4">{error}</p>
    )}
  </div>
);

const ProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  username: z.string().min(2, "Username must be at least 2 characters."),
  bio: z.string().max(200, "Bio can't exceed 200 characters.").optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid URL format.").optional(),
  github: z.string().url("Invalid GitHub URL.").optional(),
  linkedin: z.string().url("Invalid LinkedIn URL.").optional(),
  twitter: z.string().url("Invalid Twitter URL.").optional(),
  instagram: z.string().url("Invalid Instagram URL.").optional(),
  otherSocialLinks: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required."),
        url: z.string().url("Invalid URL."),
      })
    )
    .optional(),
});

const EditProfileForm = ({ initialData }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: initialData.full_name || "",
      username: initialData.username || "",
      bio: initialData.bio || "",
      location: initialData.location || "",
      website: initialData.social_links?.website || "",
      github: initialData.social_links?.github || "",
      linkedin: initialData.social_links?.linkedin || "",
      twitter: initialData.social_links?.twitter || "",
      instagram: initialData.social_links?.instagram || "",
      otherSocialLinks: initialData.social_links?.other?.length
        ? initialData.social_links.other
        : [],
    },
  });

  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherSocialLinks",
  });

  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);
    toast.success("Profile updated!");
    navigate(-1);
  };

  const handleCancel = () => {
    const confirmLeave = window.confirm("Discard unsaved changes?");
    if (confirmLeave) navigate(-1);
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
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
