"use client";

import { useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";


export default function Username() {

  const nameRef = useRef(null);
  const bioRef = useRef(null);

  const router=useRouter();

  const handleClick = async () => {
    const username = nameRef.current.value.trim();
    const bio = bioRef.current.value.trim();

    const { updateUser }=useUser();

    if (!username) {
      toast.error("Username is required");
      return;
    }

    try {
      const res = await axios.post(
        "https://quietconnect-backend.onrender.com/api/user/name",
        {
          username,
          bio,
        },
        {
          withCredentials: true,
        }
      );

      updateUser({username,bio});

      toast.success("Profile completed successfully!");

      nameRef.current.value="";
      bioRef.current.value="";

      setTimeout(() => {
        router.push("/home")
      }, 2000);

    } catch (error) {
      nameRef.current.value="";
      console.log("this is your error",error);
      
      toast.error("Username already Exist");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center space-y-6 w-full max-w-2xl">
        <h1 className="text-4xl font-semibold text-center">
          Quiet-Connect
        </h1>

        <div className="flex flex-col space-y-4 w-full">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              ref={nameRef}
              placeholder="Enter your username"
              className="border text-white border-white rounded-md px-3 py-2 outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm text-white border-white font-medium">Bio</label>
            <textarea
              ref={bioRef}
              placeholder="Write a short bio"
              rows={3}
              className="border text-white border-white rounded-md px-3 py-2 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleClick}
          className="border-white border-2 rounded-2xl px-6 py-2"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
