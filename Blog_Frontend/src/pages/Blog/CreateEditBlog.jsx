import ContentEditor from "@/components/blogEditor/ContentEditor";
import DescriptionInput from "@/components/blogEditor/DescriptionInput";
import TagInput from "@/components/blogEditor/TagInput";
import TitleInput from "@/components/blogEditor/TitleInput";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const CreateEditBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors] = useState({});

  const saveBlog = async (status = "draft") => {
    setIsSaving(true);
    try {
      console.log(`Saving blog as ${status}...`, {
        title,
        description,
        content,
        tags,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (title || description || content || tags) {
        saveBlog("draft");
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [title, description, content, tags]);

  return (
    <div className="flex flex-col max-w-4xl min-h-screen mx-auto py-8 px-4 space-y-6">
      <div className="text-lg py-2">
        {isSaving ? "Saving..." : "All changes saved"}
      </div>

      <div className="flex-grow space-y-6">
        <TitleInput value={title} onChange={setTitle} error={errors?.title} />
        <DescriptionInput
          value={description}
          onChange={setDescription}
          error={errors?.description}
        />
        <ContentEditor content={content} onChange={setContent} />
        <TagInput selectedTags={tags} setSelectedTags={setTags} />
      </div>
      <div className="p-4 flex justify-around gap-2">
        <Button variant="outline" onClick={() => saveBlog("draft")}>
          Save Draft
        </Button>
        <Button
          variant="outline"
          onClick={() => console.log("Preview triggered")}
        >
          Preview
        </Button>
        <Button onClick={() => saveBlog("published")}>Save & Publish</Button>
      </div>
    </div>
  );
};

export default CreateEditBlog;
