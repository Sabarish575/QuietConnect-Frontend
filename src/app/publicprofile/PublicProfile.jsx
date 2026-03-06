"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, MessageCircle } from "lucide-react";
import MinimalReputationGraph from "./MinimalReputationGraph";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // ✅ ADDED
import { getToken } from "@/lib/auth";

const PublicProfile = ({ id }) => {
  const router = useRouter();
  const { userId } = useUser(); // ✅ Get logged-in user id

  const isOwnProfile = String(userId) === String(id); // ✅ Compare safely

  const [userdata, setUserdata] = useState({});
  const [score, setScore] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // ================= FETCH USER DATA =================
  useEffect(() => {
    async function fetchUser() {
        const token=getToken();

      try {
        const res = await axios.get(
          `/proxy/api/user/user-data/${id}`,
          {                       headers:{
            Authorization: `Bearer ${token}`
          } }
        );
        setUserdata(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch user data");
      }
    }
    fetchUser();
  }, [id]);

  // ================= FETCH REPUTATION =================
  useEffect(() => {
    if (!id) return;

    const fetchScore = async () => {
        const token=getToken();

      try {
        const res = await axios.get(
          `/proxy/api/score/getReputation/${id}`,
          {                       headers:{
            Authorization: `Bearer ${token}`
          } }
        );
        setScore(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch reputation");
      }
    };

    fetchScore();
  }, [id]);

  // ================= FOLLOW TOGGLE =================
  const handleToggleFollow = async () => {
    if (loadingFollow || isOwnProfile) return; // ✅ Prevent self-follow

        const token=getToken();

    try {
      setLoadingFollow(true);

      const res = await axios.post(
        `/proxy/api/user/followandunfollow/${id}`,
        {},
        {                       headers:{
            Authorization: `Bearer ${token}`
          } }
      );

      const message = res.data;
      setIsFollowing(message === "Following");
      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error("Action failed");
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-black border border-white/10 rounded-3xl p-6 flex flex-col items-center">

          <div
            className="w-28 h-28 rounded-full flex items-center justify-center
                       text-white text-4xl font-bold mb-4 ring-2 ring-slate-600"
          >
            {userdata?.name?.[0]}
          </div>

          <h1 className="text-2xl font-semibold">{userdata?.name}</h1>

          <p className="text-gray-400 text-center text-sm mt-2">
            {userdata?.bio}
          </p>

          <div className="flex gap-3 mt-8 w-full">

            {/* FOLLOW BUTTON */}
            <button
              onClick={handleToggleFollow}
              disabled={loadingFollow || isOwnProfile}
              className={`flex-1 flex items-center justify-center gap-2
                py-2.5 rounded-xl font-semibold transition active:scale-[0.98]
                
                ${
                  isOwnProfile
                    ? "bg-neutral-800 text-gray-500 cursor-not-allowed"
                    : isFollowing
                    ? "bg-[#1f1f1f] text-white border border-white/10 hover:bg-[#2a2a2a]"
                    : "bg-white text-black hover:bg-gray-200"
                }
                
                ${loadingFollow ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              <UserPlus size={18} />
              {isOwnProfile
                ? "Your Profile"
                : isFollowing
                ? "Following"
                : "Follow"}
            </button>

            {/* CHAT BUTTON */}
            <button
              onClick={() => {
                if (!isOwnProfile) router.push(`/chat/${id}`);
              }}
              disabled={isOwnProfile}
              className={`flex-1 flex items-center justify-center gap-2
                         py-2.5 rounded-xl border border-white/10
                         transition active:scale-[0.98]
                         
                         ${
                           isOwnProfile
                             ? "bg-neutral-800 text-gray-500 cursor-not-allowed"
                             : "bg-[#1f1f1f] text-white hover:bg-[#2a2a2a]"
                         }`}
            >
              <MessageCircle size={18} />
              {isOwnProfile ? "Yourself" : "Chat"}
            </button>

          </div>
        </div>

        {/* ================= REPUTATION INFO ================= */}
        <div className="lg:col-span-2 bg-black border border-white/10 rounded-3xl p-6">
          <h1 className="text-2xl uppercase tracking-wide text-gray-400 mb-3">
            How Reputation Works
          </h1>

          <p className="text-sm text-gray-400 leading-relaxed">
            Reputation reflects{" "}
            <span className="text-white font-medium">
              steady, positive participation
            </span>{" "}
            on QuietConnect.
          </p>

          <p className="text-sm text-gray-400 leading-relaxed mt-3">
            Scores are updated every{" "}
            <span className="text-white font-medium">2 days</span>.
          </p>

          <p className="text-xs text-gray-500 mt-4">
            Reputation is a living metric and evolves with the community.
          </p>
        </div>

        {/* ================= REPUTATION GRAPH ================= */}
        <div className="lg:col-span-3 bg-black border border-white/10 rounded-3xl p-6">
          <h2 className="text-sm text-gray-400 mb-3">
            Reputation Over Time
          </h2>
          <MinimalReputationGraph score={score} />
        </div>

      </div>
    </div>
  );
};

export default PublicProfile;