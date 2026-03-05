"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function CommentItem({ comment }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [postingReply, setPostingReply] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const router=useRouter();

  const id=comment.userId;

  
  const username = comment.userName || "Unknown";
  const bio=comment.bio;
  const firstLetter = username.charAt(0).toUpperCase();

  /* 🔋 USER MOOD (BATTERY) */
  const mood = comment?.mood || "medium"; // high | medium | low

  const moodConfig = {
    high: { width: "90%", color: "bg-green-500" },
    medium: { width: "55%", color: "bg-yellow-400" },
    low: { width: "20%", color: "bg-red-500" },
  };

  const currentMood = moodConfig[mood] || moodConfig.medium;

  /* 🔹 Merge replies safely */
  const mergeReplies = (incoming) => {
    setReplies((prev) => {
      const map = new Map();
      [...prev, ...incoming].forEach((r) => map.set(r.id, r));
      return Array.from(map.values());
    });
  };

  /* 🔹 Load replies */
  const loadReplies = async () => {
    if (loadingReplies) return;
    setLoadingReplies(true);
    try {
      const res = await axios.get(
        `/proxy/api/getReply/${comment.id}`,
        { withCredentials: true }
      );
      mergeReplies(res.data);
    } catch (err) {
      console.error("Error loading replies:", err);
    } finally {
      setLoadingReplies(false);
    }
  };

  /* 🔹 Toggle replies */
  const toggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      loadReplies();
    }
    setShowReplies((prev) => !prev);
  };

  /* 🔹 Add reply */
  const addReply = async () => {
    if (!replyText.trim()) return;

    setPostingReply(true);
    try {
      await axios.post(
        `/proxy/api/addReply`,
        {
          comment_id: comment.id,
          reply: replyText,
        },
        { withCredentials: true }
      );

      setReplyText("");
      setShowReplyBox(false);
      setShowReplies(true);
      loadReplies();
    } catch (err) {
      console.error("Error adding reply:", err);
    } finally {
      setPostingReply(false);
    }
  };

  return (
    <div
      className="
        bg-black/70 backdrop-blur-xl
        border border-white/10
        rounded-2xl p-4
        space-y-3
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="
              size-9 rounded-full
              bg-black3
              flex items-center justify-center
              text-white font-semibold text-sm
            "
          >
            {firstLetter}
          </div>

          {/* 🔋 Mood Battery */}
          <div
            className="
              absolute -bottom-1 -right-1
              w-5 h-2
              border border-white/30
              rounded-sm bg-black
              flex items-center px-[1px]
            "
            title={`Mood: ${mood}`}
          >
            <div
              className={`h-[4px] rounded-sm ${currentMood.color}`}
              style={{ width: currentMood.width }}
            />
          </div>
        </div>

        {/* Username */}
        <div className="flex flex-col">
          <span onClick={()=>router.push(`/publicprofile/${id}`)} className="text-sm font-semibold text-white  hover:underline underline-offset-2 cursor-pointer">
            {username}
          </span>
          <span className="text-xs text-gray-400">
            {bio}
          </span>
        </div>
      </div>

      {/* COMMENT */}
      <p className="text-sm text-gray-200 leading-relaxed">
        {comment.comment}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-5 text-xs font-medium text-gray-400">
        <button
          onClick={() => setShowReplyBox((p) => !p)}
          className="hover:text-white transition"
        >
          Reply
        </button>

        <button
          onClick={toggleReplies}
          className="hover:text-white transition"
        >
          {replies.length === 0
            ? "No replies"
            : showReplies
            ? "Hide replies"
            : "View replies"}
        </button>
      </div>

      {/* REPLY INPUT */}
      {showReplyBox && (
        <div
          className="
            mt-2 rounded-xl
            border border-white/10
            bg-black/50 p-3
          "
        >
          <textarea
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a thoughtful reply…"
            className="
              w-full bg-transparent
              text-sm text-white
              placeholder-gray-500
              outline-none resize-none
            "
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={addReply}
              disabled={postingReply}
              className="
                px-4 py-1.5 rounded-full
                text-xs font-semibold
                bg-white text-black
                hover:bg-gray-200 transition
                disabled:opacity-50
              "
            >
              {postingReply ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      )}

      {/* REPLIES */}
      {showReplies && (
        <div className="space-y-2 pt-2">
          {loadingReplies && (
            <p className="ml-10 text-xs text-gray-500">
              Loading replies…
            </p>
          )}

          {replies.map((r) => (
            <div
              key={r.id}
              className="
                ml-10 p-3 rounded-xl
                bg-white/5 border border-white/10
                text-sm text-gray-200
              "
            >
              <span className="font-semibold text-white">
                {r.userName || "Unknown"}
              </span>{"\n"}
              {r.reply}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
