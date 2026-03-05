"use client";
import React from "react";
import { SquarePenIcon, Battery, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { clearToken } from "@/lib/auth";
import axios from "axios";

function Profile({ user_info, onNext }) {

  const router = useRouter();

  const {userId}=useUser();

const handleLogout = async () => {
    await axios.post("/proxy/logout", {}, { withCredentials: true });
    window.location.href = "/"; // full reload clears all state
};
  



  return (
    <section className="w-full flex justify-center px-4 py-8 bg-black text-white">
      <div className="w-full max-w-4xl flex flex-col gap-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            onClick={onNext}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 border rounded-full hover:bg-white hover:text-black transition"
          >
            <SquarePenIcon size={16} />
            Edit
          </button>
        </div>

        {/* Profile Card */}
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-6 flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{user_info.username}</h2>
          <p className="text-gray-400">
            {user_info.bio || "No bio provided"}
          </p>
        </div>

        {/* Reputation + Battery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div onClick={()=>router.push(`publicprofile/${userId}`)
          } className="border border-neutral-800 bg-neutral-900/40 cursor-pointer hover:bg-neutral-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingUp size={16} />
              Reputation
            </div>
            <span className="text-lg font-semibold text-green-400">
              +{user_info.reputation_score}
            </span>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/40 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Battery size={16} />
              Battery Level
            </div>
            <span className="text-lg font-semibold text-blue-400">
              {user_info.score}%
            </span>
          </div>

        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="border border-neutral-800 rounded-2xl p-4 flex justify-between">
            <span className="text-gray-400">Email</span>
            <span className="break-all">{user_info.email}</span>
          </div>

          <div className="border border-neutral-800 rounded-2xl p-4 flex justify-between">
            <span className="text-gray-400">Member since</span>
            <span>{user_info.createdAt}</span>
          </div>

          <div className="border border-neutral-800 rounded-2xl p-4 flex justify-between">
            <span className="text-gray-400">Communities</span>
            <span>{user_info.communityJoined}</span>
          </div>

          <div className="border border-neutral-800 rounded-2xl p-4 flex justify-between">
            <span className="text-gray-400">Posts</span>
            <span>{user_info.postsCreated}</span>
          </div>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="self-start cursor-pointer bg-red-700 px-6 py-2 rounded-full hover:bg-red-800 transition"
        >
          Log out
        </button>

      </div>
    </section>
  );
}

export default Profile;
