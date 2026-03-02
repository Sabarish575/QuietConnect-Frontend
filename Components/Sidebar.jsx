"use client";

import React, { useEffect, useState } from "react";
import {
  Menu as MenuIcon,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import CommunityWizard from "./CommunityWizard";
import axios from "axios";

function Sidebar() {
  const [topicOpen, setTopic] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const getTitle = async () => {
      try {
        const res = await axios.get("http://localhost:8080/getCommunity");
        setCommunities(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getTitle();
  }, []);

  return (
    <>
      {/* Hamburger Button (visible on mobile/tablet) */}
      <button
        onClick={() => setSidebar(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#0e1113] text-white border border-[#3e4142]"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-[250px] bg-[#0e1113] text-white border-r border-[#3e4142] transform transition-transform duration-500 ease-in-out ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button (for mobile) */}
        <div className="flex justify-end p-3 md:hidden">
          <button
            onClick={() => setSidebar(false)}
            className="p-2 rounded-full hover:bg-[#181c1f] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Menu */}
        <div className="flex flex-col items-start px-4 space-y-3">
          <Link
            href="/dashboard"
            className="cursor-pointer w-full rounded-md px-4 py-2 hover:bg-[#181c1f]"
          >
            Dashboard
          </Link>

          {/* Create Community */}
          <div
            onClick={() => setModal(true)}
            className="flex items-center space-x-2 cursor-pointer w-full rounded-md px-4 py-2 hover:bg-[#181c1f]"
          >
            <Plus className="h-5 w-5" />
            <p>Create Community</p>
          </div>

          {/* Communities Section */}
          <div className="w-full">
            <button
              onClick={() => setTopic(!topicOpen)}
              className="flex w-full justify-between items-center rounded-md px-4 py-2 hover:bg-[#181c1f]"
            >
              <span className="font-semibold uppercase">Communities</span>
              {topicOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {topicOpen && (
              <div className="flex flex-col pl-6 space-y-1 transition-all duration-300">
                {communities.length > 0 ? (
                  communities.map((item) => (
                    <Link
                      key={item.id}
                      href={`/communitypage/${item.id}`}
                      className="cursor-pointer rounded-md px-2 py-1 hover:bg-[#181c1f]"
                    >
                      {item.title}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No communities found</p>
                )}
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="w-full">
            <button
              onClick={() => setFeatureOpen(!featureOpen)}
              className="flex w-full justify-between items-center rounded-md px-4 py-2 hover:bg-[#181c1f]"
            >
              <span className="font-semibold">Features</span>
              {featureOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {featureOpen && (
              <div className="flex flex-col pl-6 space-y-1 transition-all duration-300">
                <p className="cursor-pointer rounded-md px-2 py-1 hover:bg-[#181c1f]">
                  Chat
                </p>
                <Link
                  href="/battery"
                  className="cursor-pointer rounded-md px-2 py-1 hover:bg-[#181c1f]"
                >
                  Battery
                </Link>
                <p className="cursor-pointer rounded-md px-2 py-1 hover:bg-[#181c1f]">
                  Content
                </p>
              </div>
            )}
          </div>

          {/* About Us */}
          <p className="cursor-pointer w-full rounded-md px-4 py-2 hover:bg-[#181c1f]">
            About Us
          </p>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="absolute z-50">
          <CommunityWizard modal={modal} setModal={setModal} />
        </div>
      )}
    </>
  );
}

export default Sidebar;
