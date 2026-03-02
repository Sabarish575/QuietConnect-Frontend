"use client";

import React from "react";
import Header2 from "../../../Components/Header2";
import Footer2 from "../../../Components/Footer2";
import Home from "./Home";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col overflow-x-hidden">
      <Header2 />
      <Home/>
      <Footer2 />
    </div>
  );
}
