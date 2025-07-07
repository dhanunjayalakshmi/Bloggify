import ContentEditor from "@/components/blogEditor/ContentEditor";
import DescriptionInput from "@/components/blogEditor/DescriptionInput";
import TagInput from "@/components/blogEditor/TagInput";
import TitleInput from "@/components/blogEditor/TitleInput";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreateEditBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedState, setLastSavedState] = useState({});
  const [errors] = useState({});
  const navigate = useNavigate();
  const lastSavedRef = useRef({ title, description, content, tags });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = { title, description, content, tags };
      const hasChanged =
        JSON.stringify(current) !== JSON.stringify(lastSavedRef.current);

      if (hasChanged && title.trim() && content.trim()) {
        saveBlog("draft", true);
        lastSavedRef.current = current;
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [title, description, content, tags]);

  const saveBlog = async (status = "draft", silent = false) => {
    setIsSaving(true);
    try {
      if (!title?.trim() && !content?.trim()) return;

      const payload = {
        title,
        description,
        content,
        tags: tags?.join(","),
        read_time: Math?.ceil(content?.split(" ").length / 200),
        is_published: status === "published",
        is_public: true,
      };

      const res = await api.post("/blogs/", payload);
      if (res?.statusText === "Created") {
        if (!silent) {
          toast.success(
            status === "published" ? "Blog published!" : "Draft saved."
          );
        }

        if (status === "published") {
          localStorage.removeItem("unsavedDraft");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error saving blog:", error?.response?.data || error);
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
        {isSaving && <p className="text-xs text-white">Saving draft...</p>}
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
