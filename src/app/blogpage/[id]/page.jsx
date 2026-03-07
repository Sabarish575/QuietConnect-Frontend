"use client";

import React, { useEffect, useState } from "react";
import Header2 from "../../../../Components/Header2";
import PostDetail from "../PostDetail";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

function Page() {
  const [post, setPost] = useState(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const { id } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
    const getMe = async () => {
        
      try {
        const res = await axios.get(
          "/proxy/api/user/me",
        );
        setCurrentUserId(res.data);
      } catch (error) {
        console.log("User not logged in");
      }
    };

    getMe();
  }, []);

  useEffect(() => {
    if (!id) return;
      
    const getPost = async () => {
      try {
        const res = await axios.get(
          `/proxy/api/getPosts/${id}`,
        
        );
        setPost(res.data);
      } catch (error) {
        toast.error("Unable to load post");
        console.error(error);
      }
    };

    getPost();
  }, [id]);



const handleLike = async () => {
  if (!post || loadingLike) return;
    
  setLoadingLike(true);


  try {
    const res = await axios.post(
      `/proxy/api/like/${id}`,
      {},
    );
    setPost(prev => ({
      ...prev,
      likeCount: res.data.likeCount,
      liked: res.data.liked
    }));
  } catch (error) {
    toast.error("Like failed");
    console.error(error);
  } finally {
    setLoadingLike(false);
  }
};


  return (
    <div className="flex min-h-screen flex-col bg-[#0e1113]">
      <Header2 />
      <PostDetail
        post={post}
        onLike={handleLike}
        currentUserId={currentUserId}
        setPost={setPost}
      />
    </div>
  );
}

export default Page;
