"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Battery } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

function Header2() {
  const [open, setOpen] = useState(false);
  const [energyOpen, setEnergyOpen] = useState(false);
  const [energy, setEnergy] = useState(0);

  const {username } = useUser();
  
  const segments = 5;
  const activeSegments = Math.round((energy / 100) * segments);

  const getEnergyStyles = (value) => {
    if (value <= 25) {
      return {
        bar: "bg-red-500",
        accent: "accent-red-500",
        glow: "shadow-red-500/40",
      };
    }
    if (value <= 60) {
      return {
        bar: "bg-yellow-400",
        accent: "accent-yellow-400",
        glow: "shadow-yellow-400/40",
      };
    }
    return {
      bar: "bg-green-500",
      accent: "accent-green-500",
      glow: "shadow-green-500/40",
    };
  };

  const energyStyle = getEnergyStyles(energy);

  // ESC closes overlay
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setEnergyOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(()=>{

    const fetch=async ()=>{
      try {

      const res = await axios.get("https://quietconnect-backend.onrender.com/api/user/getPercentage",
      {withCredentials: true});

      setEnergy(res.data || 0);
            
      } catch (error) {
        console.log(error.data);
      }
    }

    fetch();

  },[])


  async function handleBattery(){
    try {

      const res = await axios.post("https://quietconnect-backend.onrender.com/api/user/addBattery",
      energy,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );


    toast.success("Saved successfully");

    setTimeout(()=>{
      setEnergyOpen(false)
    },700)
      
    } catch (error) {

      console.log(error.data);
      
      
    }
  }

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 md:px-6 h-16 sm:h-[72px]">
          {/* Logo */}
          <Link
            href="/home"
            className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent whitespace-nowrap"
          >
            Quiet·Connect
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-300">
            {[
              { name: "Home", href: "/home" },
              { name: "Community", href: "/exploreCommunity" },
              { name: "Chat", href: "/chat" },
              { name: "Post", href: "/addpage" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-white transition"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Battery */}
            <button
              onClick={() => setEnergyOpen(true)}
              className="p-2 sm:p-2.5 rounded-md border border-white/30 hover:bg-white/10 transition"
              title="Energy level"
            >
              <Battery className="text-white" size={18} />
            </button>

            {/* Avatar */}
            <Link
              href="/profile"
              className="size-8 sm:size-9 rounded-full border border-white/20 flex items-center justify-center bg-white/5 hover:bg-white/10 transition"
            >
              <span className="text-white font-semibold text-xs sm:text-sm uppercase">
                {username?.[0] || "U"}
              </span>
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 sm:p-2.5 rounded-full hover:bg-white/10 transition"
            >
              {open ? (
                <X className="text-white" />
              ) : (
                <Menu className="text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ENERGY OVERLAY */}
      {energyOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-3 sm:px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setEnergyOpen(false)}
          />

          <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-2xl bg-neutral-950 border border-white/10 shadow-2xl p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base sm:text-lg font-semibold text-white">
                Energy Check-in
              </h2>
              <button
                onClick={() => setEnergyOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Battery */}
            <div className="flex justify-center mb-6">
              <div className={`flex items-center gap-2 p-2 rounded-lg shadow-lg ${energyStyle.glow}`}>
                <div className="flex border border-neutral-700 rounded-md p-1 bg-neutral-900">
                  {Array.from({ length: segments }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-7 sm:h-8 w-4 sm:w-5 mx-0.5 rounded-sm transition-all duration-300 ${
                        i < activeSegments
                          ? energyStyle.bar
                          : "bg-neutral-800"
                      }`}
                    />
                  ))}
                </div>
                <div className="h-4 w-1 rounded-sm bg-neutral-600" />
              </div>
            </div>

            {/* Percentage */}
            <div className="text-center mb-5">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {energy}%
              </span>
              <p className="text-xs sm:text-sm text-neutral-400">
                Current energy
              </p>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className={`w-full ${energyStyle.accent}`}
            />

            <button onClick={()=>handleBattery()} className="mt-5 w-full rounded-xl bg-white text-black font-medium py-2.5 hover:bg-neutral-200 transition">
              Save
            </button>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="fixed z-50 top-16 sm:top-[72px] inset-x-3 sm:inset-x-4 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl p-6 space-y-4 text-center">
            {[
              { name: "Home", href: "/home" },
              { name: "Community", href: "/exploreCommunity" },
              { name: "Chat", href: "/chat" },
              { name: "Post", href: "/addpage" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block text-gray-300 hover:text-white transition font-medium text-sm sm:text-base"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Header2;
