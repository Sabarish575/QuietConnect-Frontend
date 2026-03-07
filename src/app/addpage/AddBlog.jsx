"use client";

import { getToken } from "@/lib/auth";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function AddBlogContent() {
  const router = useRouter();
  const descRef = useRef(null);
  const titleRef = useRef(null);
  const searchParams = useSearchParams();

  const [communityInp, setCommunityInp] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [com, setCom] = useState(null);
  const [enable, setEnable] = useState(false);

  const [isMember, setIsMember] = useState(null);
  const [checkingMember, setCheckingMember] = useState(false);
  const [joining, setJoining] = useState(false);



  /* Preselect community from params */
  useEffect(() => {
    const communityId = searchParams.get("CommunityId");
    const communityTitle = searchParams.get("CommunityTitle");

    if (communityId && communityTitle) {
      setCom({
        id: Number(communityId),
        communityTitle: decodeURIComponent(communityTitle),
      });
      setEnable(true);
    }
  }, [searchParams]);

  /* Auto resize */
  useEffect(() => {
    const resize = (el) => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    };

    const desc = descRef.current;
    const title = titleRef.current;

    const descHandler = () => resize(desc);
    const titleHandler = () => resize(title);

    desc?.addEventListener("input", descHandler);
    title?.addEventListener("input", titleHandler);

    return () => {
      desc?.removeEventListener("input", descHandler);
      title?.removeEventListener("input", titleHandler);
    };
  }, []);

  /* 🔥 Check Membership when community selected */
  useEffect(() => {
    if (!com?.id) {
      setIsMember(null);
      return;
    }

    

    const checkMembership = async () => {
        
      try {
        setCheckingMember(true);

        const res = await axios.get(
          `/proxy/api/isMember/${com.id}`
        );

        setIsMember(res.data);
      } catch (error) {
        console.error(error);
        setIsMember(false);
      } finally {
        setCheckingMember(false);
      }
    };

    checkMembership();
  }, [com]);

  /* 🔥 Join / Unjoin */
  const handleJoinToggle = async () => {
    if (!com?.id) return;

      

    try {
      setJoining(true);

      const res = await axios.post(
        `/proxy/api/community/joinandunjoin/${com.id}`,
        {}
      );

      console.log("your response from add blog",res.data);
      
      if (res.data.message === "followed") {
        toast.success("Joined successfully!");
        setIsMember(true);
      } else {
        toast.success("Left community");
        setIsMember(false);
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setJoining(false);
    }
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!com) {
      toast.error("Please select a community!");
      return;
    }

    if (!isMember) {
      toast.error("You must join the community first.");
      return;
    }

    const sendPost = {
      title: titleRef.current?.value,
      communityId: com?.id,
      description: descRef.current?.value,
    };

      

    try {
      const res = await axios.post(
        "/proxy/api/addPosts",
        sendPost,
        {
          headers: { "Content-Type": "application/json"},
        }
      );

      toast.success("Posted Successfully!");

      setTimeout(() => {
        router.push(`/communitypage/${res.data}`);
      }, 800);

      titleRef.current.value = "";
      descRef.current.value = "";
      setCommunityInp("");
      setCom(null);
      setEnable(false);
      setSuggestion([]);
      setIsMember(null);
    } catch (error) {
      toast.error("Failed to post");
    }
  };

  /* Debounce */
  const debounce = (callback, delay = 500) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(...args), delay);
    };
  };

  const handleSuggestion = debounce(async (query) => {
    if (!query.trim()) return setSuggestion([]);
      
    try {
      const res = await axios.get(
        `/proxy/api/community/search/${query}`);
      setSuggestion(res.data);
    } catch {
      setSuggestion([]);
    }
  }, 500);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.9)]"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Create Post
          </h1>
          <p className="text-sm text-gray-500">
            Share something valuable with your community
          </p>
        </div>

        {/* Community Search */}
        <div className="relative">
          {enable ? (
            <input
              readOnly
              value={com.communityTitle || ""}
              onClick={() => setEnable(false)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white cursor-pointer"
            />
          ) : (
            <input
              type="text"
              placeholder="Search community..."
              value={communityInp}
              onChange={(e) => {
                setCommunityInp(e.target.value);
                handleSuggestion(e.target.value);
              }}
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white"
            />
          )}

          {!enable && suggestion.length > 0 && (
            <ul className="absolute w-full mt-2 z-20 bg-black/95 backdrop-blur-xl border border-white/30 rounded-xl max-h-56 overflow-y-auto">
              {suggestion.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setCom(item);
                    setCommunityInp(item.communityTitle);
                    setEnable(true);
                  }}
                  className="text-white px-4 py-3 hover:bg-white/10 cursor-pointer"
                >
                  {item.communityTitle}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔥 Membership Banner */}
        {com && isMember === false && (
          <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm flex items-center justify-between">
            <p className="text-sm text-white">
              You must join this community to post.
            </p>
            <button
              type="button"
              onClick={handleJoinToggle}
              disabled={joining}
              className="px-4 py-2 rounded-lg bg-yellow-400 text-black text-sm font-semibold hover:opacity-90 transition"
            >
              {joining ? "Joining..." : "Join"}
            </button>
          </div>
        )}

        <textarea
          ref={titleRef}
          rows={2}
          placeholder="Post title"
          className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-lg text-white resize-none"
        />

        <textarea
          ref={descRef}
          rows={4}
          placeholder="Write your thoughts..."
          className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white resize-none"
        />

        <button
          type="submit"
          disabled={!com || isMember !== true || checkingMember}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            !com || isMember !== true
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "text-black bg-gradient-to-r from-white to-gray-300 hover:opacity-90"
          }`}
        >
          {checkingMember ? "Checking..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}

export default function AddBlog() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <AddBlogContent />
    </Suspense>
  );
}