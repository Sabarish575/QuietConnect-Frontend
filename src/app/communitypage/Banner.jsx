'use client';

import { getToken } from "@/lib/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Banner({ Community, id }) {
  const router = useRouter();

  const [joined, setJoined] = useState(false);
  const [members, setMembers] = useState(0);

  /* =========================
     Sync joined + members
     ========================= */
  useEffect(() => {
    if (!Community || !id) return;

    // set members safely
    setMembers(Community.members ?? 0);

    // check joined status
    const checkJoined = async () => {
        

      try {
        const res = await axios.get(
          `/proxy/api/community/check/${id}`,
        );
        setJoined(res.data);
      } catch {
        console.log("Failed to fetch joined status");
        toast.error("failed to fetch");
      }
    };

    checkJoined();
  }, [Community, id]);

  if (!Community) return null;

  /* =========================
     Handlers
     ========================= */
  function handleRedirection() {
    if (!joined) {
      toast.error("Join the community to create a post");
      return;
    }

    router.push(
      `/addpage?CommunityId=${id}&CommunityTitle=${Community.communityTitle}`
    );
  }

  async function handleJoinandUnjoin() {
        

    try {
      const res = await axios.post(
        `/proxy/api/community/joinandunjoin/${id}`,
        {}
      );

      const message = res.data.message;

      if (message==="followed") {
        toast.success("Followed successfully");
        setMembers(prev => prev + 1);
        setJoined(true);
      } else {
        toast.success("Unfollowed successfully");
        setMembers(prev => Math.max(prev - 1, 0));
        setJoined(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="w-full flex flex-col gap-8">

      {/* HERO */}
      <div className="relative h-[220px] sm:h-[260px] rounded-2xl overflow-hidden bg-black border border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {Community.communityTitle}
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            {members} {members === 1 ? "member" : "members"}
          </p>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">

        {/* About */}
        <div className="flex flex-col gap-6 max-w-3xl">
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
            {Community.communityBio}
          </p>

          <div className="flex flex-wrap gap-3">
            {Community.topicIds?.map(item => (
              <span
                key={item}
                className="px-4 py-1.5 text-sm rounded-full border border-white/15 text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                #{item}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 self-start lg:self-center">
          <button
            onClick={handleJoinandUnjoin}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition active:scale-[0.97] cursor-pointer ${
              joined
                ? "bg-white text-black hover:bg-gray-200"
                : "border border-white/30 text-white hover:bg-white/10"
            }`}
          >
            {joined ? "Joined" : "Join"}
          </button>

          <button
            onClick={handleRedirection}
            className="px-6 py-2.5 rounded-full font-semibold text-black bg-gradient-to-r from-white to-gray-300 hover:to-white transition active:scale-[0.97] cursor-pointer"
          >
            + Create post
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
