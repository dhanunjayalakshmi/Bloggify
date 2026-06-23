import { useState, useEffect, useRef } from "react";
import api from "@/lib/apiClient";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { format } from "timeago.js";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "../ui/textarea";
import { useAuthStore } from "@/stores/authStore";
import ContentVotes from "./ContentVotes";
import { hydrateVotesForContent } from "@/utils/hydrateVotesForContent";
import useMentions from "@/hooks/useMentions";
import MentionDropdown from "./MentionDropdown";
import { Pin, PinOff } from "lucide-react";

const CommentEditor = ({ blogId, parentId = "", onSubmit, onCancel, initial = "" }) => {
  const [content, setContent] = useState(initial);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const handleContentChange = (e) => setContent(e.target.value);
  const { isOpen, users, selectedIndex, coords, handleChange, handleKeyDown, selectUser } =
    useMentions(content, handleContentChange, textareaRef);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      if (initial === "") {
        await api.post("/comments", { blog_id: blogId, content, parent_id: parentId || null });
        onSubmit?.();
      } else {
        onSubmit?.(content);
      }
      setContent("");
      setLoading(false);
      onCancel?.();
    } catch (err) {
      console.error("BlogComments error:", { message: err?.message, response: err?.response?.data });
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        className="border w-full p-2 rounded"
        rows={3}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Write a comment... (use @ to mention someone)"
      />
      {isOpen && (
        <MentionDropdown users={users} selectedIndex={selectedIndex} coords={coords} onSelect={selectUser} />
      )}
      <div className="flex gap-2 mt-4">
        <Button onClick={handleSubmit} disabled={loading || !content.trim()}>
          {initial ? "Update" : "Comment"}
        </Button>
        {onCancel && <Button variant="outline" onClick={onCancel}>Cancel</Button>}
      </div>
    </div>
  );
};

const highlightMentions = (text) => {
  if (typeof text !== "string") return text;
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^@[a-zA-Z0-9_]+$/.test(part) ? (
      <span key={i} className="text-blue-500 font-semibold bg-blue-50 dark:bg-blue-900/20 rounded px-0.5">
        {part}
      </span>
    ) : part
  );
};

const MentionParagraph = ({ children }) => (
  <p>
    {Array.isArray(children)
      ? children.map((child, i) =>
          typeof child === "string" ? <span key={i}>{highlightMentions(child)}</span> : child
        )
      : typeof children === "string"
        ? highlightMentions(children)
        : children}
  </p>
);

const CommentItem = ({ comment, blogId, blogAuthorId, refresh, isReply = false }) => {
  const [showReply, setShowReply] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [replyCount, setReplyCount] = useState(comment?.reply_count ?? 0);
  const [pinning, setPinning] = useState(false);

  const userId = useAuthStore((state) => state?.profile?.id);
  const isCommentAuthor = userId === comment?.user_id;
  const isBlogAuthor = userId === blogAuthorId;
  const commenterIsAuthor = comment?.user_id === blogAuthorId;

  const fetchReplies = async () => {
    if (repliesLoaded) { setRepliesLoaded(false); return; }
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
    await api.put(`/comments/${comment.id}`, { content: newContent });
    setShowEdit(false);
    refresh();
  };

  const handlePin = async () => {
    setPinning(true);
    try {
      await api.patch(`/comments/${comment.id}/pin`);
      refresh();
    } catch (err) {
      console.error("Pin error:", err);
    } finally {
      setPinning(false);
    }
  };

  return (
    <div className="flex gap-3 mb-8">
      <div
        className={`flex-1 rounded-lg shadow-lg px-4 py-3 ${
          commenterIsAuthor
            ? "dark:bg-gray-800 bg-orange-50 border-l-2 border-orange-500"
            : "dark:bg-gray-800"
        }`}
      >
        {/* Pinned indicator */}
        {comment?.is_pinned && (
          <div className="flex items-center gap-1 text-xs text-orange-500 font-medium mb-2">
            <Pin className="w-3 h-3" />
            Pinned comment
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                className="w-10 h-10 rounded-full object-cover"
                src={
                  comment?.users?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
                }
              />
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {comment?.users?.name ?? "User"}
                </span>
                {commenterIsAuthor && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-500 text-white font-medium leading-none">
                    Author
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">{format(comment?.created_at)}</span>
            </div>
          </div>

          {/* Pin button — only for blog author, only on top-level comments */}
          {isBlogAuthor && !isReply && (
            <button
              onClick={handlePin}
              disabled={pinning}
              className="p-1.5 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-pointer transition-colors"
              title={comment?.is_pinned ? "Unpin comment" : "Pin comment"}
            >
              {comment?.is_pinned
                ? <PinOff className="w-4 h-4 text-orange-500" />
                : <Pin className="w-4 h-4 text-gray-400 hover:text-orange-500" />
              }
            </button>
          )}
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
            <ReactMarkdown components={{ p: MentionParagraph }}>
              {comment?.content}
            </ReactMarkdown>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <ContentVotes contentId={comment.id} contentType="comment" mode="upvote-only" />
          <Button size="sm" variant="ghostButton" onClick={() => setShowReply((v) => !v)}>
            Reply
          </Button>
          {isCommentAuthor && (
            <>
              <Button size="sm" variant="ghostButton" onClick={() => setShowEdit((v) => !v)}>Edit</Button>
              <Button size="sm" variant="ghostButton" onClick={handleDelete}>Delete</Button>
            </>
          )}
          {replyCount > 0 && (
            <Button size="sm" variant="ghostButton" onClick={fetchReplies}>
              {repliesLoaded ? "Hide Replies" : `Show Replies (${replyCount})`}
            </Button>
          )}
        </div>

        {showReply && (
          <div className="ml-6 mt-3">
            <CommentEditor
              blogId={blogId}
              parentId={comment?.id}
              onSubmit={() => {
                setShowReply(false);
                setReplyCount((c) => c + 1);
                setRepliesLoaded(false);
                fetchReplies();
              }}
              onCancel={() => setShowReply(false)}
            />
          </div>
        )}

        {repliesLoaded &&
          replies?.map((reply) => (
            <div className="ml-8 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4" key={reply?.id}>
              <CommentItem
                comment={reply}
                blogId={blogId}
                blogAuthorId={blogAuthorId}
                refresh={fetchReplies}
                isReply={true}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

const BlogComments = ({ blogId, blogAuthorId }) => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [forceReload, setForceReload] = useState(0);

  const COMMENTS_PAGE_SIZE = 10;

  useEffect(() => {
    const fetchComments = async () => {
      const res = await api.get(`/comments/${blogId}?page=1&limit=${COMMENTS_PAGE_SIZE}`);
      setComments(res?.data?.comments || []);
      setPage(2);
      setHasMore((res?.data?.comments?.length || 0) === COMMENTS_PAGE_SIZE);
    };
    fetchComments();
  }, [blogId, forceReload]);

  useEffect(() => {
    if (!comments?.length) return;
    hydrateVotesForContent({ contentType: "comment", items: comments });
  }, [comments]);

  const loadMoreComments = async () => {
    const res = await api.get(`/comments/${blogId}?page=${page}&limit=${COMMENTS_PAGE_SIZE}`);
    const newComments = (res?.data?.comments || []).filter(
      (newC) => !comments.some((oldC) => oldC.id === newC.id)
    );
    setComments((prev) => [...prev, ...newComments]);
    setPage((p) => p + 1);
    setHasMore((res?.data?.comments?.length || 0) === COMMENTS_PAGE_SIZE);
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
            blogAuthorId={blogAuthorId}
            refresh={refresh}
          />
        ))}
        {hasMore && (
          <Button className="mt-4 mx-auto block w-1/2 max-w-xs" onClick={loadMoreComments}>
            Show More Comments
          </Button>
        )}
      </div>
    </div>
  );
};

export default BlogComments;
