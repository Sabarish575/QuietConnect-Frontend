"use client";

import { HeartIcon, MessageSquare, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CommentSection from "./CommentSection";
import { useRouter } from "next/navigation";

function PostDetail({ post, onLike, currentUserId, setPost }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editedAt, setEditedAt] = useState(null);

  const router=useRouter();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setEditedAt(post.editedAt || null);
    }
  }, [post]);

  if (!post) return null;


  const isOwner = post?.createdBy?.userId === currentUserId;

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description cannot be empty");
      return;
    }
        

    setLoadingEdit(true);

    try {
      const res = await axios.patch(
        `/proxy/api/editPost/${post.id}`,
        { title, description }
      );

      /* ✅ Update parent state instead of mutating props */
      setPost((prev) => ({
        ...prev,
        title: res.data.title,
        description: res.data.description,
        editedAt: res.data.editedAt,
      }));

      setEditedAt(res.data.editedAt);
      toast.success("Post updated successfully");
      setIsEditing(false);

    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("You are not allowed to edit this post");
      } else {
        toast.error("Failed to update post");
      }
      console.error(err);
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-6 py-20">
      <article className="w-full max-w-3xl space-y-10">
        
        {/* COMMUNITY */}
        <Link
          href={`/communitypage/${post.communityId.id}`}
          className="text-xs tracking-widest uppercase text-white/40 hover:text-white/70 transition"
        >
          {post.communityId.title}
        </Link>

        {/* TITLE */}
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className="
              w-full bg-transparent
              border-b border-white/10
              pb-3 text-white
              text-3xl sm:text-4xl font-semibold
              outline-none focus:border-white/30
            "
          />
        ) : (
          <div className="flex items-start justify-between gap-6">
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
              {post.title}
            </h1>

            {isOwner && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-white/30 hover:text-white transition"
              >
                <Edit2 size={18} />
              </button>
            )}
          </div>
        )}

        {/* META */}
        <div className="text-sm text-white/40 flex items-center gap-3">
          <span onClick={()=>router.push(`/publicprofile/${post?.createdBy?.userId}`)} className="text-white/70 font-medium cursor-pointer hover:underline-offset-2">
            {post.createdBy.name}
          </span>
          <span>•</span>
          <span>{post.createdAt}</span>
          {editedAt && (
            <>
              <span>•</span>
              <span className="italic">edited</span>
            </>
          )}
        </div>

        {/* CONTENT */}
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="
              w-full bg-transparent
              border border-white/10
              rounded-xl
              px-4 py-4
              text-base
              text-white/90
              outline-none focus:border-white/30
              resize-none
            "
          />
        ) : (
          <div className="text-base sm:text-lg leading-8 text-white/80 whitespace-pre-line">
            {post.description}
          </div>
        )}

        {/* EDIT ACTIONS */}
        {isEditing && (
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleSave}
              disabled={loadingEdit}
              className="
                px-6 py-2 rounded-full
                bg-white text-black
                text-sm font-medium
                hover:bg-white/90 transition
                disabled:opacity-50
              "
            >
              {loadingEdit ? "Saving…" : "Save"}
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(post.title);
                setDescription(post.description);
              }}
              className="
                px-6 py-2 rounded-full
                border border-white/15
                text-white/60
                hover:text-white hover:border-white/30
                transition
              "
            >
              Cancel
            </button>
          </div>
        )}

        {/* ACTION BAR */}
        <div className="flex items-center gap-8 pt-6 border-t border-white/5 text-sm text-white/50">
          
          <button
            onClick={onLike}
            className="flex items-center gap-2 hover:text-white transition"
          >
            <HeartIcon size={18} />
            <span>{post.likeCount}</span>
          </button>

          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            <span>{post.commentsCount}</span>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="pt-10 border-t border-white/5">
          <CommentSection postId={post.id} />
        </div>

      </article>
    </div>
  );
}

export default PostDetail;