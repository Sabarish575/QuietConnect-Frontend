"use client"

import React from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast';

function CommunityCreation({ 
  communityTitle, 
  setCommunityTitle, 
  communityBio, 
  setCommunityBio, 
  onNext, 
  modal, 
  handleClose 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!communityTitle.trim() || !communityBio.trim()) {
      toast.error("Fill all the fields");
      return;
    }

    onNext();
  }

  const handleClear = () => {
    setCommunityTitle("");
    setCommunityBio("");
  }

  return (
    <div className={`${modal ? "flex" : "hidden"} fixed inset-0 items-center justify-center bg-black/70 p-4 z-50`}>
      <div className="relative flex flex-col w-full max-w-xl text-white p-5 rounded-xl bg-black border-2 border-white space-y-5">
        <button onClick={handleClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-[#2a3339] transition">
          <X className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold">Tell us about your community</h1>
          <p className="text-sm text-gray-300">A name and description help people understand your community.</p>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3 md:w-1/2">
            <input
              className="px-3 py-2 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              maxLength={20}
              type="text"
              placeholder="Community name"
              value={communityTitle}
              onChange={(e) => setCommunityTitle(e.target.value)}
            />
            <textarea
              className="min-h-[100px] px-3 py-2 rounded-md bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-white"
              maxLength={500}
              placeholder="Description"
              value={communityBio}
              onChange={(e) => setCommunityBio(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={handleClear} className="px-3 py-1 cursor-pointer rounded-md bg-gray-600 hover:bg-gray-700 transition text-sm">
                Reset
              </button>
              <button type="submit" className="px-3 py-1 text-black cursor-pointer rounded-md bg-white hover:bg-white/60 transition text-sm">
                Next
              </button>
            </div>
          </form>

          <div className="md:w-1/2 bg-gray-700 p-3 rounded-xl flex flex-col space-y-2">
            <h2 className="text-base font-semibold">{communityTitle || "Community name"}</h2>
            <p className="text-gray-300 text-sm">{communityBio || "Description"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityCreation
