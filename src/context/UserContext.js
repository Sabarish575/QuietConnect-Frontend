"use client";

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
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("/proxy/api/user/username");
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

  const logout = async () => {
    await axios.post("/proxy/api/auth/logout"); // clears cookie server-side
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