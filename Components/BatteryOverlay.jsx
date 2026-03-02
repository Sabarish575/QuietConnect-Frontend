"use client";

import React, { useState, useRef, useEffect } from "react";
import { Battery } from "lucide-react";

export default function BatteryOverlay() {
  const [open, setOpen] = useState(false);
  const [energy, setEnergy] = useState(72);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const energyColor =
    energy <= 30
      ? "bg-red-500"
      : energy <= 65
      ? "bg-yellow-400"
      : "bg-green-500";

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-white/5 transition"
      >
        <Battery size={20} className="text-neutral-300" />

        {/* Energy Dot */}
        <span
          className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${energyColor}`}
        />
      </button>

      {/* Mini Panel */}
      {open && (
        <div className="absolute right-0 top-12 w-56 rounded-xl bg-neutral-900 border border-white/10 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-white font-medium">Energy</p>
            <span className="text-xs text-neutral-400">{energy}%</span>
          </div>

          {/* Minimal Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-white"
          />

          {/* Status */}
          <p className="mt-2 text-xs text-neutral-400">
            {energy <= 30
              ? "Low — take a break"
              : energy <= 65
              ? "Balanced"
              : "High — great focus"}
          </p>
        </div>
      )}
    </div>
  );
}
