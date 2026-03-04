import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CommentItem from "./CommentItem";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  // 🔒 prevents double initial fetch (React 18 StrictMode)
  const initialLoadRef = useRef(false);

  // Load initial comments when postId changes
  useEffect(() => {
    initialLoadRef.current = false;
    setComments([]);
    setPage(0);
    setHasMore(true);
    loadComments(0);
  }, [postId]);

  const loadComments = async (pageNo) => {
    if (loading || !hasMore) return;

    // 🚫 stop duplicate initial call
    if (pageNo === 0 && initialLoadRef.current) return;
    if (pageNo === 0) initialLoadRef.current = true;

    setLoading(true);

    try {
      const res = await axios.get(
        `https://quietconnect-backend.onrender.com/api/comments/${postId}?page=${pageNo}`,
        { withCredentials: true }
      );

      const fetchedComments = res.data.content;

      // ✅ deduplicate SAFELY using functional update
      setComments((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const unique = fetchedComments.filter(
          (c) => !existingIds.has(c.id)
        );
        return [...prev, ...unique];
      });

      setHasMore(!res.data.last);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;

    setPosting(true);
    try {
      const res = await axios.post(
        `https://quietconnect-backend.onrender.com/api/addComment`,
        { post_id: postId, comment: commentText },
        { withCredentials: true }
      );

      
      // ✅ prepend safely without duplicates
      setComments((prev) => {
        if (prev.some((c) => c.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });

      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Write Comment */}
      <div className="bg-[#1a1e22] rounded-lg p-3">
        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full bg-transparent text-sm text-white outline-none resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={addComment}
            disabled={posting}
            className="text-xs text-blue-400 hover:underline disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Comments */}
      {comments.map((c) => (
        <CommentItem
          key={c.id}      
          comment={c}
          postId={postId}
        />
      ))}

      {/* Load More */}
      {hasMore && (
        <button
          onClick={() => loadComments(page)}
          disabled={loading}
          className="text-xs text-slate-400 hover:underline"
        >
          {loading ? "Loading..." : "Load more comments"}
        </button>
      )}
    </div>
  );
}

export default CommentSection;
