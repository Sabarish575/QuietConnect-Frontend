
"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignUp from "../../Components/SignUp";
import axios from "axios";
import { useUser } from "@/context/UserContext";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    axios.get("https://quietconnect-backend.onrender.com/auth/me", {
      withCredentials: true,
    })
    .then(res => {
      const user = res.data;
      if (user.username) {
        router.push("/home");
      } else {
        router.push("/set-username");
      }
    })
    .catch(() => {
      // 401 or error = not logged in, stay on signup page
      setLoading(false);
    })
    .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // or a spinner

  return (
    <div className='bg-black h-screen flex justify-center'>
      <SignUp/>
    </div>
  );
}