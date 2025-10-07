import { useState, useEffect } from "react";
import api from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { format } from "timeago.js";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "../ui/textarea";
import { useAuthStore } from "@/stores/authStore";

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
    if (!content.trim()) return;
    setLoading(true);

    try {
      if (initial === "") {
        await api.post("/comments", {
          blog_id: blogId,
          content,
          parent_id: parentId || null,
        });

        onSubmit?.();
      } else {
        onSubmit?.(content);
      }
      setContent("");
      setLoading(false);
      onCancel?.();
    } catch (error) {
      console.log("Unable to submit comment ...", error?.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <Textarea
        className="border w-full p-2 rounded"
        rows={3}
        value={content}
        onChange={(e) => setContent(e?.target?.value)}
        placeholder="Write a comment (Markdown supported)..."
      />
      <div className="flex gap-2 mt-4">
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

  const userId = useAuthStore((state) => state?.profile?.id);

  const fetchReplies = async () => {
    if (repliesLoaded) {
      setRepliesLoaded(false);
      return;
    }
    if (!repliesLoaded && replies?.length === 0) {
      const res = await api?.get(`/comments/${blogId}/replies/${comment?.id}`);
      setReplies(res?.data?.replies);
      setRepliesLoaded(true);
    } else {
      setRepliesLoaded(false);
      setReplies([]);
    }
  };

  const handleDelete = async () => {
    await api?.delete(`/comments/${comment.id}`);
    refresh();
  };

  const handleEdit = async (newContent) => {
    console.log("Came here for update", newContent);
    await api.put(`/comments/${comment.id}`, { content: newContent });
    setShowEdit(false);
    refresh();
  };

  return (
    <div className="flex gap-3 mb-8">
      <div className="flex-1 rounded-lg dark:bg-gray-800 shadow-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-10 w-10 cursor-pointer"
            // onClick={() => navigate(`/user/${users?.id || 1}`)}
          >
            <AvatarImage
              className="w-10 h-10 rounded-full object-cover"
              src={
                comment?.users?.avatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
              }
            />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {comment?.users?.name ?? "User"}
            </span>
            <span className="text-xs text-gray-500">
              {format(comment?.created_at)}
            </span>
          </div>
        </div>
        {showEdit ? (
          <CommentEditor
            blogId={blogId}
            parentId={comment?.parent_id}
            initial={comment?.content}
            onSubmit={handleEdit}
            onCancel={() => setShowEdit(false)}
          />
        ) : (
          <div className="mt-4 prose prose-sm dark:prose-invert">
            <ReactMarkdown>{comment?.content}</ReactMarkdown>
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            variant="ghostButton"
            onClick={() => setShowReply((v) => !v)}
          >
            Reply
          </Button>

          {userId === comment?.user_id && (
            <>
              <Button
                size="sm"
                variant="ghostButton"
                onClick={() => setShowEdit((v) => !v)}
              >
                Edit
              </Button>
              <Button size="sm" variant="ghostButton" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
          <Button size="sm" variant="ghostButton" onClick={fetchReplies}>
            {repliesLoaded ? "Hide Replies" : "Show Replies"}
          </Button>
        </div>
        {showReply && (
          <div className="ml-6 mt-3">
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
        {repliesLoaded &&
          replies?.map((reply) => (
            <div
              className="ml-8 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [forceReload, setForceReload] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await api.get(`/comments/${blogId}?page=1&limit=10`);
      setComments(res?.data?.comments || []);
      setPage(2);
      setHasMore((res?.data?.comments?.length || 0) === 10);
    };
    fetchComments();
  }, [blogId, forceReload]);

  const loadMoreComments = async () => {
    const res = await api.get(`/comments/${blogId}?page=${page}&limit=1`);
    const newComments = (res?.data?.comments || []).filter(
      (newC) => !comments.some((oldC) => oldC.id === newC.id)
    );
    setComments((comments) => [...comments, ...newComments]);
    setPage((page) => page + 1);
    setHasMore((res?.data?.comments?.length || 0) === 10);
  };

  const refresh = () => setForceReload((v) => v + 1);

  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-2">Comments</h3>
      <CommentEditor blogId={blogId} onSubmit={() => refresh()} />
      <div className="mt-4 space-y-4">
        {comments?.map((comment) => (
          <CommentItem
            key={comment?.id}
            comment={comment}
            blogId={blogId}
            refresh={refresh}
          />
        ))}

        {hasMore && (
          <Button
            className="mt-4 mx-auto block w-1/2 max-w-xs"
            onClick={loadMoreComments}
          >
            Show More Comments
          </Button>
        )}
      </div>
    </div>
  );
};

export default BlogComments;
