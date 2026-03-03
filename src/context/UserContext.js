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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          "https://quietconnect-backend.onrender.com/api/user/username",
          { withCredentials: true }
        );

        // Backend now returns: userId, username, bio
        console.log("context user", res);
        
        setUser(res.data);
      } catch (error) {
        console.log(error);
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
    <UserContext.Provider value={{ ...user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}