import ContentEditor from "@/components/blogEditor/ContentEditor";
import DescriptionInput from "@/components/blogEditor/DescriptionInput";
import TitleInput from "@/components/blogEditor/TitleInput";
import { useState } from "react";

const CreateEditBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [errors] = useState({});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <TitleInput value={title} onChange={setTitle} error={errors?.title} />
      <DescriptionInput
        value={description}
        onChange={setDescription}
        error={errors?.description}
      />
      <ContentEditor content={content} onChange={setContent} />
    </div>
  );
};

export default CreateEditBlog;
