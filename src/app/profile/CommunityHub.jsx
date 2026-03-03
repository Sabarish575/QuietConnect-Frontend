"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PostCard from "./PostCard";

const TABS = [
  { key: "created", label: "Created" },
  { key: "joined", label: "Joined" },
  { key: "posts", label: "Your Posts" },
  { key: "comments", label: "Your Comments" },
];

const PAGE_SIZE = 10;

function CommunityHub() {
  const [activeTab, setActiveTab] = useState("created");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    created: [],
    joined: [],
    posts: [],
    comments: [],
  });

  const [page, setPage] = useState({
    posts: 0,
    comments: 0,
  });

  const [postPageInfo, setPostPageInfo] = useState({
    first: true,
    last: false,
  });

  const [commentPageInfo, setCommentPageInfo] = useState({
    first: true,
    last: false,
  });

  /* =========================
     INITIAL FETCH
  ========================= */
  useEffect(() => {
    fetchCommunities();
  }, []);

  /* =========================
     RESET PAGE ON TAB SWITCH
  ========================= */
  useEffect(() => {
    if (activeTab === "posts") {
      setPage((p) => ({ ...p, posts: 0 }));
    }
    if (activeTab === "comments") {
      setPage((p) => ({ ...p, comments: 0 }));
    }
  }, [activeTab]);

  /* =========================
     PAGINATED FETCH TRIGGERS
  ========================= */
  useEffect(() => {
    if (activeTab === "posts") fetchUserPosts();
    if (activeTab === "comments") fetchUserComments();
  }, [activeTab, page.posts, page.comments]);

  /* =========================
     FETCH COMMUNITIES
  ========================= */
  const fetchCommunities = async () => {
    try {
      const [createdRes, joinedRes] = await Promise.all([
        axios.get("https://quietconnect-backend.onrender.com/api/community/createdCom", {
          withCredentials: true,
        }),
        axios.get("https://quietconnect-backend.onrender.com/api/community/joinedCom", {
          withCredentials: true,
        }),
      ]);

      setData((prev) => ({
        ...prev,
        created: createdRes.data || [],
        joined: joinedRes.data || [],
      }));
    } catch {
      toast.error("Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH USER POSTS
  ========================= */
  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(
        "https://quietconnect-backend.onrender.com/api/getUserCreatedPosts",
        {
          params: { page: page.posts, size: PAGE_SIZE },
          withCredentials: true,
        }
      );

      setData((prev) => ({
        ...prev,
        posts: res.data.content || [],
      }));

      setPostPageInfo({
        first: res.data.first,
        last: res.data.last,
      });
    } catch {
      toast.error("Failed to load posts");
    }
  };

  /* =========================
     FETCH USER COMMENTS
  ========================= */
  const fetchUserComments = async () => {
    try {
      const res = await axios.get(
        "https://quietconnect-backend.onrender.com/api/getUserCommentedPosts",
        {
          params: { page: page.comments, size: PAGE_SIZE },
          withCredentials: true,
        }
      );

      setData((prev) => ({
        ...prev,
        comments: res.data.content || [],
      }));

      setCommentPageInfo({
        first: res.data.first,
        last: res.data.last,
      });
    } catch {
      toast.error("Failed to load comments");
    }
  };

  /* =========================
     DELETE COMMUNITY
  ========================= */
  const deleteCommunity = async (communityId) => {
    try {
      await axios.delete(
        `https://quietconnect-backend.onrender.com/api/community/delete/${communityId}`,
        { withCredentials: true }
      );

      setData((prev) => ({
        ...prev,
        created: prev.created.filter(
          (c) => c.communityId !== communityId
        ),
      }));

      toast.success("Community deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 text-white">

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md rounded-full p-1 flex gap-1 mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm rounded-full cursor-pointer transition ${
              activeTab === tab.key
                ? "bg-white text-black font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {activeTab === "created" &&
          data.created.map((c) => (
            <Card
              key={c.communityId}
              id={c.communityId}
              title={c.communityTitle}
              desc={c.communityBio}
              meta={`👥 ${c.communityCount}`}
              action="Delete"
              onClick={() => deleteCommunity(c.communityId)}
            />
          ))}

        {activeTab === "joined" &&
          data.joined.map((c) => (
            <Card
              key={c.communityId}
              id={c.communityId}
              title={c.communityTitle}
              desc={c.communityBio}
              meta={`Joined`}
            />
          ))}

        {activeTab === "posts" &&
          data.posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}

        {activeTab === "comments" &&
          data.comments.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
      </div>

      {/* Pagination */}
      {activeTab === "posts" && (
        <Pagination
          first={postPageInfo.first}
          last={postPageInfo.last}
          onPrev={() => setPage((p) => ({ ...p, posts: p.posts - 1 }))}
          onNext={() => setPage((p) => ({ ...p, posts: p.posts + 1 }))}
        />
      )}

      {activeTab === "comments" && (
        <Pagination
          first={commentPageInfo.first}
          last={commentPageInfo.last}
          onPrev={() =>
            setPage((p) => ({ ...p, comments: p.comments - 1 }))
          }
          onNext={() =>
            setPage((p) => ({ ...p, comments: p.comments + 1 }))
          }
        />
      )}

      {data[activeTab]?.length === 0 && (
        <p className="text-gray-500 text-center mt-12">
          Nothing here yet
        </p>
      )}
    </section>
  );
}

/* =========================
   COMMENT CARD
========================= */
function CommentCard({ comment }) {
  const router= useRouter();
  return (
    <div onClick={() => router.push(`/blogpage/${comment.postId}`)} className="rounded-2xl p-5 bg-black border border-white/10
        hover:border-white/25
        hover:bg-white/5
        transition-all duration-200
        cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-sm">
          {comment.userName?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium">{comment.userName}</p>
          <p className="text-xs text-white/40">{comment.bio}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-white/80">
        {comment.comment}
      </p>

      <p className="mt-3 text-xs text-white/40">
        {comment.createdAt}
      </p>
    </div>
  );
}

/* =========================
   PAGINATION
========================= */
function Pagination({ first, last, onPrev, onNext }) {
  return (
    <div className="flex justify-center gap-4 mt-10">
      <button
        disabled={first}
        onClick={onPrev}
        className="px-4 py-2 rounded-full border border-gray-600
        hover:bg-gray-800 disabled:opacity-40"
      >
        Prev
      </button>

      <button
        disabled={last}
        onClick={onNext}
        className="px-4 py-2 rounded-full border border-gray-600
        hover:bg-gray-800 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

/* =========================
   CARD COMPONENT
========================= */
function Card({
  title,
  desc,
  id,
  meta,
  action,
  onClick,
  routePrefix = "communitypage",
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/${routePrefix}/${id}`)}
      className="rounded-2xl p-5 bg-[#101010] border border-white/10 hover:border-white/25 cursor-pointer"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/50 line-clamp-2">{desc}</p>
      {meta && <span className="block mt-3 text-xs text-white/40">{meta}</span>}

      {action && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-red-600"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export default CommunityHub;
