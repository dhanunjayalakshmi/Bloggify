import ContentEditor from "@/components/blogEditor/ContentEditor";
import DescriptionInput from "@/components/blogEditor/DescriptionInput";
import TagInput from "@/components/blogEditor/TagInput";
import TitleInput from "@/components/blogEditor/TitleInput";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "unsavedDraft";

const CreateEditBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const lastSavedRef = useRef({
    title: "",
    description: "",
    content: "",
    tags: [],
  });

  // Load from localStorage or preview
  useEffect(() => {
    const saved = localStorage?.getItem(LOCAL_STORAGE_KEY);
    // console.log(saved);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        console.log(draft);
        setTitle(draft?.title || "");
        setDescription(draft?.description || "");
        setContent(draft?.content || "");
        setTags(draft?.tags || []);
        lastSavedRef.current = draft;
      } catch (err) {
        console.error("Failed to parse saved draft:", err);
      }
    }
    // else if (location?.state) {
    //   const { title, description, content, tags } = location.state;
    //   setTitle(title);
    //   setDescription(description);
    //   setContent(content);
    //   setTags(tags);
    //   lastSavedRef.current = { title, description, content, tags };
    // }
  }, [location.state]);

  const hasUnsavedChanges = () => {
    return (
      JSON.stringify({ title, description, content, tags }) !==
      JSON.stringify(lastSavedRef.current)
    );
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [title, description, content, tags]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hasUnsavedChanges()) {
        const draft = { title, description, content, tags };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
        lastSavedRef.current = draft;
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [title, description, content, tags]);

  const saveBlog = async (status = "draft", silent = false) => {
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
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
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        lastSavedRef.current = { title, description, content, tags };

        if (!silent) {
          toast.success(
            status === "published" ? "Blog published!" : "Draft saved."
          );
        }

        if (status === "published") {
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
    const current = { title, description, content, tags };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    navigate("/preview", { state: current });
  };

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
