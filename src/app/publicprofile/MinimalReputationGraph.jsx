"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function MinimalReputationGraph({ score }) {
  // Ensure score is an array; if single object, wrap in array
  const reputationData = Array.isArray(score) ? score : [score];

  // Map backend data to chart data
  const chartData = reputationData.map((item) => ({
    date: new Date(item.snapShotDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: item.score ?? 0, // Handle score = 0 or undefined
  }));

  return (
    <div className="w-full h-[200px] sm:h-[240px] md:h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          {/* Gradient */}
          <defs>
            <linearGradient id="reputationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e5e7eb" stopOpacity={0.35} />
              <stop offset="60%" stopColor="#e5e7eb" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#e5e7eb" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* X Axis */}
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#1f2933" }}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#1f2933" }}
            tickLine={false}
            domain={[0, "dataMax + 10"]} // Ensures zero is visible
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              background: "#0f0f0f",
              border: "1px solid #222",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#aaa" }}
            cursor={{ stroke: "#222" }}
          />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#e5e7eb"
            strokeWidth={2.5}
            fill="url(#reputationGradient)"
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
