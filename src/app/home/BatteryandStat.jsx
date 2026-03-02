"use client";

import React from "react";
import { BatteryFull, TrendingUp, Users } from "lucide-react";

export default function BatteryandStat() {
  return (
    <section className="w-full px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Battery Card */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0f0f0f] border border-white/5 p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <BatteryFull className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-100">
                  Energy Level
                </h2>
                <p className="text-sm text-gray-400">
                  Mental & physical balance today
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-semibold">90%</p>
              <p className="text-sm text-gray-400">Balanced</p>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-white/10 rounded-full">
            <div className="h-full w-[90%] bg-white rounded-full" />
          </div>

          {/* Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400">Today’s Goal</p>
              <p className="text-sm text-gray-200">Maintain balance</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-300" />
              <p className="text-sm text-gray-200">Improving</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-3xl bg-[#0f0f0f] border border-white/5 p-6 space-y-4">
          <h2 className="text-base font-medium text-center">
            Quick Stats
          </h2>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Communities</span>
            <span className="font-medium">10</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Posts</span>
            <span className="font-medium">42</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Streak</span>
            <span className="font-medium">7 days</span>
          </div>
        </div>

      </div>
    </section>
  );
}
