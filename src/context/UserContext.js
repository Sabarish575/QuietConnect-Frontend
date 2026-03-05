"use client";

import { clearToken, extractAndStoreToken, getToken } from "@/lib/auth";
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
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "https://quietconnect-backend.onrender.com/api/user/username",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
      } catch (error) {
        console.log(error);
        if (error?.response?.status === 401) {
          clearToken();
        }
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

  const logout = () => {
    clearToken();
    setUser({ userId: null, username: "", bio: "" });
  };

  return (
    <UserContext.Provider value={{ ...user, loading, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}