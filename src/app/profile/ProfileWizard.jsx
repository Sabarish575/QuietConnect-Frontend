"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

import Profile from "./Profile";
import EditProfile from "./EditProfile";
import CommunityManagement from "./CommunityHub";
import CommunityHub from "./CommunityHub";

function ProfileWizard() {
  const [activeTab, setActiveTab] = useState("profile"); // profile | communities
  const [editMode, setEditMode] = useState(false);

  const { updateUser } = useUser();

  const [user_info, setUser_info] = useState({});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(
        "/proxy/api/user/user-info",
        { withCredentials: true }
      );

      setUser_info(res.data);
      setName(res.data.username || "");
      setBio(res.data.bio || "");
      setEmail(res.data.email || "");
    } catch {
      toast.error("Failed to fetch user info");
    }
  };

  const onSave = async () => {
    if (!name.trim()) {
      toast.error("Username is required");
      return;
    }

    try {
      await axios.put(
        "/proxy/api/user/change_info",
        { username: name, bio },
        { withCredentials: true }
      );

      setUser_info(prev => ({
        ...prev,
        username: name,
        bio,
      }));

      updateUser({ username: name, bio });
      toast.success("Profile updated");
      setEditMode(false);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <section className="w-full flex flex-col items-center bg-black text-white">
      
      {/* 🔁 Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTab("profile");
            setEditMode(false);
          }}
          className={`px-4 py-2 rounded-2xl border cursor-pointer ${
            activeTab === "profile" ? "bg-white text-black" : "border-white"
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => {
            setActiveTab("communities");
            setEditMode(false);
          }}
          className={`px-4 py-2 rounded-2xl border cursor-pointer ${
            activeTab === "communities" ? "bg-white text-black" : "border-white"
          }`}
        >
          Communities
        </button>
      </div>

      {/* 🧠 Content */}
      {activeTab === "profile" && !editMode && (
        <Profile user_info={user_info} onNext={() => setEditMode(true)} />
      )}

      {activeTab === "profile" && editMode && (
        <EditProfile
          name={name}
          setName={setName}
          bio={bio}
          setBio={setBio}
          email={email}
          onBack={() => setEditMode(false)}
          onSave={onSave}
        />
      )}

      {activeTab === "communities" && <CommunityHub />}
    </section>
  );
}

export default ProfileWizard;
