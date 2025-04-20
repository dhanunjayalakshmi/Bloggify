import ContentEditor from "@/components/blogEditor/ContentEditor";
import DescriptionInput from "@/components/blogEditor/DescriptionInput";
import TagInput from "@/components/blogEditor/TagInput";
import TitleInput from "@/components/blogEditor/TitleInput";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const CreateEditBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedState, setLastSavedState] = useState({});
  const [errors] = useState({});
  const navigate = useNavigate();

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
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    navigate("/preview", {
      state: {
        title: title,
        description: description,
        content: content,
        tags: tags,
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const current = { title, description, content, tags };
      if (JSON.stringify(current) !== JSON.stringify(lastSavedState)) {
        saveBlog("draft");
        setLastSavedState(current);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [title, description, content, tags, lastSavedState]);

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
        <Button variant="outline" onClick={handlePreview}>
          Preview
        </Button>
        <Button onClick={() => saveBlog("published")}>Save & Publish</Button>
      </div>
    </div>
  );
};

export default CreateEditBlog;
