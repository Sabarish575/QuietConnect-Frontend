"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  HeartIcon,
  MessageCircle,
  Battery,
} from "lucide-react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

/* ------------------ Helpers ------------------ */
function Avatar({ name, onClick }) {
  return (
    <div
      onClick={onClick}
      className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-semibold text-neutral-200 shrink-0 cursor-pointer"
    >
      {name?.charAt(0)?.toUpperCase()}
    </div>
  );
}

function formatTime(timeString) {
  if (!timeString) return "";
  return timeString.slice(0, 8);
}

function energyClass(energy) {
  if (energy <= 25) {
    return "bg-red-500/15 text-red-400 border-red-500/30";
  }
  if (energy <= 60) {
    return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  }
  return "bg-green-500/15 text-green-400 border-green-500/30";
}

function energySlider(energy) {
  if (energy <= 25) return "bg-red-500";
  if (energy <= 60) return "bg-amber-500";
  return "bg-green-500";
}

/* ------------------ Energy Badge ------------------ */
function EnergyBadge({ energy }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${energyClass(
        energy
      )}`}
    >
      <Battery className="h-3 w-3" />
      {energy}
    </span>
  );
}

/* ------------------ Left Energy Profile ------------------ */
function EnergyProfile() {
  const [userCard, setUserCard] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "http://quietconnect-backend.onrender.com/api/user/userCard",
          { withCredentials: true }
        );
        setUserCard(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 rounded-3xl bg-neutral-900/60 border border-neutral-800 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-semibold text-neutral-200">
            {userCard.username?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-neutral-200">
              {userCard.username}
            </p>
            <p className="text-xs text-neutral-500">{userCard.bio}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
            <span>Energy</span>
            <span>{userCard.score || 0}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${energySlider(
                userCard.score || 0
              )}`}
              style={{ width: `${userCard.score || 0}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------ Right Stats ------------------ */
function RightStats() {
  const [postStat, setPostStat] = useState({});
  const { userId } = useUser(); 
  const router = useRouter();     // 👈 router

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "http://quietconnect-backend.onrender.com/api/user/userStat",
          { withCredentials: true }
        );
        setPostStat(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 rounded-3xl bg-neutral-900/40 border border-neutral-800 p-5 space-y-6">

        <p className="text-xs text-neutral-500 uppercase tracking-wide">
          This week
        </p>

        <div className="space-y-4">
          <Stat label="Posts" value={postStat.noOfPosts || 0} />
          <Stat label="Comments" value={postStat.noOfComments || 0} />

          {/* 👇 Reputation Clickable */}
          <div
            onClick={() => router.push(`/publicprofile/${userId}`)}
            className="cursor-pointer hover:bg-white/5 p-2 rounded-lg transition"
          >
            <Stat
              label="Reputation"
              value={`+${postStat.reputationScore || 0}`}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-lg font-semibold text-neutral-200">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}

/* ------------------ Feed Card ------------------ */
function FeedCard({
  id,
  community,
  authorId,
  author,
  energy,
  time,
  content,
  likeCount,
  commentCount,
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/blogpage/${id}`)}
      className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4 sm:p-5 space-y-3 cursor-pointer hover:border-white/25 hover:bg-white/5 transition-all"
    >
      <div className="flex items-center gap-3">
        <Avatar
          name={author}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/profile/${authorId}`);
          }}
        />

        <div className="text-sm">
          <div className="flex items-center gap-2">
            <p className="text-neutral-200 font-medium">{author}</p>
            <EnergyBadge energy={energy} />
          </div>
          <p className="text-neutral-500 text-xs">
            {community} · {time}
          </p>
        </div>
      </div>

      <p className="text-neutral-200 text-sm sm:text-base">
        {content}
      </p>

      <div className="flex items-center gap-6 text-neutral-500 text-xs">
        <span className="flex items-center gap-1">
          <HeartIcon className="h-4 w-4" /> {likeCount}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" /> {commentCount}
        </span>
      </div>
    </div>
  );
}

/* ------------------ Home Page ------------------ */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const anchorRef = useRef(null);
  const observerRef = useRef(null);
  const fetchingRef = useRef(false);
  const pageRef = useRef(0);

  const { username } = useUser();

  console.log("from home page your user name", username);
  
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && !username) {
      router.replace("/");
    }
  }, [mounted, username, router]);

  const fetchFeed = useCallback(async () => {
    if (fetchingRef.current || !hasMore) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const res = await axios.get(
        "http://quietconnect-backend.onrender.com/api/userFeed",
        {
          params: { page: pageRef.current, size: 10 },
          withCredentials: true,
        }
      );

      const incoming = res.data.content || [];

      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.postId));
        return [...prev, ...incoming.filter((p) => !ids.has(p.postId))];
      });

      if (res.data.last || incoming.length === 0) {
        setHasMore(false);
      } else {
        pageRef.current += 1;
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [hasMore]);

  useEffect(() => {
    if (mounted) fetchFeed();
  }, [mounted, fetchFeed]);

  useEffect(() => {
    if (!mounted || !hasMore) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && fetchFeed(),
      { rootMargin: "200px" }
    );

    anchorRef.current && observerRef.current.observe(anchorRef.current);

    return () => observerRef.current?.disconnect();
  }, [mounted, hasMore, fetchFeed]);

  if (!mounted) return null;

  return (
    <main className="flex-1 bg-black text-white overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        <EnergyProfile />

        <div className="flex-1 max-w-2xl mx-auto space-y-6">
          <header>
            <h1 className="text-2xl font-serif">
              Welcome back, {username}
            </h1>
            <p className="text-neutral-400 text-sm">
              Stay balanced. Stay connected. Move at your own pace.
            </p>
          </header>

          {posts.map((p) => (
            <FeedCard
              key={p.postId}
              id={p.postId}
              community={p.community_name}
              authorId={p.userId}
              author={p.username}
              energy={p.score}
              time={formatTime(p.createdAt)}
              content={p.description}
              likeCount={p.likeCount}
              commentCount={p.commentCount}
            />
          ))}

          {loading && (
            <p className="text-center text-sm text-neutral-500">
              Loading…
            </p>
          )}
          {!hasMore && (
            <p className="text-center text-sm text-neutral-600">
              The End 
            </p>
          )}

          <div ref={anchorRef} />
        </div>

        <RightStats />
      </div>
    </main>
  );
}