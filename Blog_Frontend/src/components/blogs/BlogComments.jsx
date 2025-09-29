import { useState, useEffect } from "react";
import api from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
// import { Avatar } from "@/components/ui/avatar"; // use your Avatar implementation

const CommentEditor = ({
  blogId,
  parentId = "",
  onSubmit,
  onCancel,
  initial = "",
}) => {
  const [content, setContent] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!content.trim()) return;
      setLoading(true);
      const { error } = await api.post("/comments", {
        blog_id: blogId,
        content,
        parent_id: parentId || null,
      });
      if (error) throw error;
      setContent("");
      setLoading(false);
      onSubmit?.();
    } catch (error) {
      console.log("Unable to post a comment ... ", error?.message);
    }
  };

  return (
    <div>
      <textarea
        className="border w-full p-2 rounded"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment (Markdown supported)..."
      />
      <div className="flex gap-2 mt-2">
        <Button onClick={handleSubmit} disabled={loading || !content.trim()}>
          {initial ? "Update" : "Comment"}
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

const CommentItem = ({ comment, blogId, refresh }) => {
  const [showReply, setShowReply] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);

  const fetchReplies = async () => {
    if (repliesLoaded) return;
    const res = await api?.get(`/comments/${blogId}/replies/${comment?.id}`);
    setReplies(res?.data?.replies);
    setRepliesLoaded(true);
  };

  const handleDelete = async () => {
    await api?.delete(`/comments/${comment.id}`);
    refresh();
  };

  const handleEdit = async (newContent) => {
    await api?.put(`/comments/${comment?.id}`, { content: newContent });
    setShowEdit(false);
    refresh();
  };

  return (
    <div className="flex gap-3 mb-4">
      {/* Replace with your Avatar UI */}
      {/* <Avatar src={comment.users?.avatar} /> */}
      <div className="flex-1">
        <div className="text-sm font-medium">
          {comment?.users?.name ?? "User"}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(comment?.created_at).toLocaleString()}
        </div>
        {showEdit ? (
          <CommentEditor
            blogId={blogId}
            parentId={comment?.parent_id}
            initial={comment?.content}
            onSubmit={() => handleEdit(comment?.content)}
            onCancel={() => setShowEdit(false)}
          />
        ) : (
          <ReactMarkdown className="prose">{comment?.content}</ReactMarkdown>
        )}
        <div className="flex gap-2 mt-1">
          <Button
            size="small"
            variant="outline"
            onClick={() => setShowReply((v) => !v)}
          >
            Reply
          </Button>
          <Button
            size="small"
            variant="outline"
            onClick={() => setShowEdit((v) => !v)}
          >
            Edit
          </Button>
          <Button size="small" variant="outline" onClick={handleDelete}>
            Delete
          </Button>
          <Button size="small" variant="outline" onClick={fetchReplies}>
            {repliesLoaded ? "Hide Replies" : "Show Replies"}
          </Button>
        </div>
        {showReply && (
          <div className="ml-4 mt-2">
            <CommentEditor
              blogId={blogId}
              parentId={comment?.id}
              onSubmit={() => {
                setShowReply(false);
                setRepliesLoaded(false);
                fetchReplies();
              }}
              onCancel={() => setShowReply(false)}
            />
          </div>
        )}
        {/* Nested Replies */}
        {repliesLoaded &&
          replies?.map((reply) => (
            <div
              className="ml-6 border-l-2 border-gray-200 pl-2"
              key={reply?.id}
            >
              <CommentItem
                comment={reply}
                blogId={blogId}
                refresh={fetchReplies}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

const BlogComments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [forceReload, setForceReload] = useState(0);

  useEffect(() => {
    try {
      const fetchComments = async () => {
        const { res, error } = await api.get(`/comments/${blogId}`);

        if (error) throw error;
        setComments(res?.data?.comments);
      };
      fetchComments();
    } catch (error) {
      console.log("Unable to fetch Comments", error?.message);
    }
  }, [blogId, forceReload]);

  const refresh = () => setForceReload((v) => v + 1);

  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-2">Comments</h3>
      <CommentEditor blogId={blogId} onSubmit={refresh} />
      <div className="mt-4 space-y-4">
        {comments?.map((comment) => (
          <CommentItem
            key={comment?.id}
            comment={comment}
            blogId={blogId}
            refresh={refresh}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogComments;
