"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Send, ArrowLeft } from "lucide-react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getToken } from "@/lib/auth";

export default function Chat({ autoOpenUserId }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});

  const stompClientRef = useRef(null);
  const inpRef = useRef(null);
  const chatEndRef = useRef(null);
  const activeUserRef = useRef(null);

  useEffect(() => {
    activeUserRef.current = activeUser;
  }, [activeUser]);

  /* ---------------- Current User ---------------- */

  useEffect(() => {
        

    axios
      .get("/proxy/api/user/me")
      .then((res) => setCurrentUser(res.data))
      .catch(console.log);
  }, []);

  /* ---------------- Fetch Friends ---------------- */

  useEffect(() => {
    fetchChatFriends();
  }, []);

  const fetchChatFriends = async () => {
        

    try {
      const res = await axios.get(
        "/proxy/api/chat/getFriend"
      );
      
      setFriends(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      
      if (err.response?.status === 204) setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Auto Open Chat ---------------- */

  useEffect(() => {
    if (!autoOpenUserId) return;

        


    const openChat = async () => {
      let userToOpen = friends.find(
        (u) => Number(u.userId) === Number(autoOpenUserId)
      );

      if (!userToOpen) {
        try {
          const res = await axios.get(
            `/proxy/api/user/user-data/${autoOpenUserId}`);
          userToOpen = res.data;
        } catch (err) {
          return;
        }
      }

      handleFetchChat(userToOpen);
    };

    openChat();
  }, [autoOpenUserId, friends]);

  /* ---------------- WebSocket ---------------- */

  useEffect(() => {
    if (!currentUser) return;
    const connectWebSocket=async ()=>{

      const res=await axios.get("/api/auth/token");
      const token=res.data.token;

      const socket = new SockJS(`https://quietconnect-backend.onrender.com/chat?token=${token}`);

      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders:{
          Authorization:`Bearer ${token}`
        },
        onConnect: () => {
          stompClient.subscribe("/user/queue/messages", (msg) => {
            const data = JSON.parse(msg.body);
            setChats((prev) => [...prev, data]);

            if (data.senderId !== activeUserRef.current?.userId) {
              setUnreadMap((prev) => ({
                ...prev,
                [data.senderId]: true,
              }));
            }
          });

          stompClient.subscribe("/user/queue/notifications", (msg) => {
            try {
              const data = JSON.parse(msg.body);
              if (data!== activeUserRef.current?.userId) {
                setUnreadMap((prev) => ({
                  ...prev,
                  [data]: true,
                }));
              }
            } catch {
              console.log("Notification payload is not JSON:", msg.body);
            }
          });
        },
      });

      stompClient.activate();
      stompClientRef.current = stompClient;
    }

    connectWebSocket();
    return () => stompClientRef.current?.deactivate();
  }, [currentUser]);

  /* ---------------- Fetch Chat ---------------- */

  const handleFetchChat = async (user) => {
    setActiveUser(user);
    setUnreadMap((prev) => ({
      ...prev,
      [user.userId]: false,
    }));

    try {
      const res = await axios.get(
        `/proxy/api/chat/getOldchat/${user.userId}`
      );
      
      setChats(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setChats([]);
    }
  };

  /* ---------------- Send Message ---------------- */

  const handleSubmit = () => {
    if (!stompClientRef.current?.connected || !activeUser) return;

    const msg = inpRef.current.value.trim();
    if (!msg) return;

    stompClientRef.current.publish({
      destination: "/app/private-message",
      body: JSON.stringify({
        receiverId: activeUser.userId,
        message: msg,
      }),
    });

    setChats((prev) => [
      ...prev,
      {
        senderId: currentUser,
        receiverId: activeUser.userId,
        message: msg,
      },
    ]);

    inpRef.current.value = "";
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside
        className={`w-full md:w-[320px] border-r border-white/10 bg-[#090909] 
        ${activeUser ? "hidden md:block" : "block"}`}
      >
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-semibold">Chats</h1>
        </div>

        <div className="overflow-y-auto p-3">
          {friends.map((user) => (
            <div
              key={user.userId}
              onClick={() => handleFetchChat(user)}
              className={`relative p-3 rounded-xl hover:bg-white/5 cursor-pointer 
              ${activeUser?.userId === user.userId ? "bg-white/10" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 bg-neutral-800 rounded-full flex items-center justify-center">
                    {user.name?.[0]}
                  </div>
                  <div>
                    <h2 className="text-sm font-medium">{user.name}</h2>
                    <p className="text-xs text-gray-400">{user.bio}</p>
                  </div>
                </div> 
                {/* 🔴 Dot shows on the friend who sent the notification */}
                  {unreadMap[user.userId] && (
                    <span className="flex items-center justify-center h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <main className={`flex-1 flex flex-col ${activeUser ? "flex" : "hidden md:flex"}`}>
        {!activeUser && (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}

        {activeUser && (
          <>
            <header className="h-14 border-b border-white/10 flex items-center px-4 gap-3">
              <button className="md:hidden" onClick={() => setActiveUser(null)}>
                <ArrowLeft />
              </button>
              <h1 className="font-semibold">{activeUser.name}</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chats.map((c, i) => (
                <div
                  key={i}
                  className={`flex ${
                    c.senderId === currentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm 
                    ${
                      c.senderId === currentUser
                        ? "bg-gray-700 rounded-br-sm"
                        : "bg-white/10 rounded-bl-sm"
                    }`}
                  >
                    {c.message}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  ref={inpRef}
                  className="flex-1 bg-white/5 px-4 py-2 rounded-full outline-none"
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button
                  onClick={handleSubmit}
                  className="p-3 bg-gray-700 rounded-full"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}