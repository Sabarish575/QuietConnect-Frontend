"use client";

import { extractAndStoreToken } from "@/lib/auth";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = useState({
    userId: null,
    username: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    extractAndStoreToken();

    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          "https://quietconnect-backend.onrender.com/api/user/username",
          { withCredentials: true }
        );
        setUser(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const updateUser = ({ username, bio }) => {
    setUser((prev) => ({
      ...prev,
      ...(username !== undefined && { username }),
      ...(bio !== undefined && { bio }),
    }));
  };

  return (
    <UserContext.Provider value={{ ...user, loading, updateUser }}> {/* 👈 expose loading */}
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}