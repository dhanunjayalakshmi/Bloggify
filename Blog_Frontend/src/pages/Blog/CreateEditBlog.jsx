import TitleInput from "@/components/blogEditor/TitleInput";
import { useState } from "react";

const CreateEditBlog = () => {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <TitleInput value={title} onChange={setTitle} error={errors?.title} />
    </div>
  );
};

export default CreateEditBlog;
