"use client";

import { HeartIcon, MessageSquare } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Header2 from "../../../../Components/Header2";
import Footer2 from "../../../../Components/Footer2";
import Banner from "../Banner";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function Community() {
  const { id } = useParams();

  const [community, setCommunity] = useState([]);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);

  /* Fetch Community */
  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://quietconnect-backend.onrender.com/api/community/${id}`, {
        withCredentials: true,
      })
      
      .then(res => setCommunity(res.data))
      .catch(console.error);
      
  }, [id]);

  /* Fetch Posts */
  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `http://quietconnect-backend.onrender.com/api/getCommunityPosts/${id}`,
        {
          params: { page, size: 10 },
          withCredentials: true,
        }
      );

      setPosts(prev => [...prev, ...res.data.content]);
      setHasMore(!res.data.last);
      setPage(prev => prev + 1);
    } catch {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  /* Reset on ID change */
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
  }, [id]);

  /* Infinite Scroll */
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      entries => entries[0].isIntersecting && fetchPosts(),
      { threshold: 0.8 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      <Header2 />

      <main className="relative min-h-screen bg-black text-white">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
          {/* Banner */}
          <Banner Community={community} id={id} />

          {/* Posts */}
          <section className="space-y-5">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blogpage/${post.id}`}
                className="
                  group block
                  rounded-2xl
                  border border-white/10
                  bg-black/60 backdrop-blur-xl
                  p-5 sm:p-6
                  transition-all duration-300
                  hover:border-white/20
                  hover:bg-white/5
                "
              >
                {/* Title */}
                <h2 className="
                  text-lg sm:text-xl
                  font-semibold
                  mb-2
                  text-white
                  group-hover:text-gray-100
                ">
                  {post.title}
                </h2>

                {/* Description */}
                <p className="
                  text-gray-400
                  text-sm sm:text-base
                  line-clamp-3
                  mb-4
                ">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-6 text-gray-500 text-sm">
                  <div className="flex items-center gap-2 group-hover:text-white transition">
                    <HeartIcon size={18} />
                    <span>{post.likeCount}</span>
                  </div>

                  <div className="flex items-center gap-2 group-hover:text-white transition">
                    <MessageSquare size={18} />
                    <span>{post.commentCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {/* Loader */}
          {hasMore && (
            <div
              ref={observerRef}
              className="h-16 flex items-center justify-center text-gray-500 text-sm"
            >
              {loading && (
                <span className="animate-pulse">
                  Loading more posts…
                </span>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer2 />
    </>
  );
}

export default Community;
