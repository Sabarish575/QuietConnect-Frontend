"use client"
import React, { useEffect } from "react";

function EditProfile({ name, setName, bio, setBio, email, onBack, onSave }) {
    


  return (
    <section className="w-full flex justify-center p-4 bg-black">
      <div className="w-full max-w-3xl flex flex-col gap-6">

        {/* Editable Profile Card */}
        <div className="w-full border-2 p-6 rounded-3xl flex flex-col gap-4 bg-white/10 backdrop-blur-lg border-white/20">
          <h1 className="text-xl font-semibold">Edit Profile</h1>

          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-white">Username</label>
            <input
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Username"
              className="w-full border-2 p-2 rounded-xl font-medium text-white"
              required
            />
          </div>

          {/* Bio Field */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-white">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Your Bio"
              className="w-full border-2 p-2 rounded-xl font-medium text-white"
              rows={4}
            />
          </div>

          {/* Email Display */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-white">Email</label>
            <p className="font-medium text-white">{email || "Not provided"}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={onSave}
              className="flex-1 p-2 cursor-pointer rounded-3xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>
            <button
              onClick={onBack}
              className="flex-1 p-2 cursor-pointer rounded-3xl bg-red-700 text-white hover:bg-red-800 transition"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default EditProfile;
