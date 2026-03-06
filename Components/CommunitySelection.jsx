"use client";

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getToken } from '@/lib/auth';

function CommunitySelection({ topicIds = [], setTopicIds, onPrev, handleSubmit, modal, handleClose }) {
  const [topics, setTopics] = useState([]);          // grouped topics by category
  const [filteredTopics, setFilteredTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const token=getToken();
      try {
        const res = await axios.get("/proxy/api/topics", {                       headers:{
            Authorization: `Bearer ${token}`
          } });
        const topicsArray = Array.isArray(res.data) ? res.data : res.data.data;

        if (!Array.isArray(topicsArray)) { toast.error("Invalid topics data from backend"); return }

        const grouped = topicsArray.reduce((acc, topic) => {
          const cat = topic.category || "Other";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(topic);
          return acc;
        }, {});

        const formatted = Object.keys(grouped).map(cat => ({
          title: cat,
          topics: grouped[cat]
        }));

        setTopics(formatted);
        setFilteredTopics(formatted);

      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch topics");
      }
    };

    fetchTopics();
  }, []);

  const handleSelect = (topic) => {
    const id = Number(topic.topic_id);
    setTopicIds(prev => {
      if (!prev) prev = []; // safety
      if (prev.includes(id)) return prev.filter(t => t !== id);
      else if (prev.length < 3) return [...prev, id];
      else { toast.error("You can select up to 3 topics"); return prev; }
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = topics
      .map(cat => ({ ...cat, topics: cat.topics.filter(t => t.name.toLowerCase().includes(query)) }))
      .filter(cat => cat.topics.length > 0);
    setFilteredTopics(filtered);
  };

  const topicMap = topics.flatMap(cat => cat.topics || [])
                         .reduce((acc, t) => { acc[t.topic_id] = t.name; return acc }, {});

  // ✅ Safe defaults
  const safeTopicIds = topicIds || [];

  return (
    <div className={`${modal ? "flex" : "hidden"} fixed inset-0 items-center justify-center  p-4`}>
      <div className="relative flex flex-col space-y-6 w-full max-w-2xl max-h-[600px] text-white px-4 sm:px-6 py-6 border-2 border-white rounded-2xl bg-black">

        <button onClick={handleClose} className="absolute top-4 right-4 bg-[#2a3339] rounded-full flex items-center justify-center hover:bg-[#3a4349] transition">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col space-y-2 pr-12">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Add 3 Topics</h1>
          <p className="text-sm sm:text-base tracking-tight md:tracking-wide">
            Add up to 3 topics to help interested nestlings find your Nest.
          </p>
        </div>

        <div className='flex flex-col space-y-2'>
          <input
            onChange={handleSearch}
            type='search'
            className='rounded-full px-3 py-1 border-2 border-white focus:ring-2 focus:ring-white'
            placeholder='Search Topics'
          />
          <p className='text-base ml-1'>{safeTopicIds.length}/3 topics selected</p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5'>
          {safeTopicIds.length > 0 ? safeTopicIds.map((id) => (
            <div key={id} className='bg-gray-500 px-2 py-1 rounded-full hover:bg-gray-600 cursor-pointer flex items-center justify-between space-x-2 max-w-[200px]'>
              <span>{topicMap[id]}</span>
              <X onClick={() => handleSelect({ topic_id: id })} className='w-5 h-5' />
            </div>
          )) : <p>Choose topics</p>}
        </div>

        <div className='p-2 overflow-auto flex flex-col space-y-4 h-[400px]'>
          {filteredTopics.length === 0 ? (
            <p className="text-gray-400">No topics found.</p>
          ) : (
            filteredTopics.map((cat, index) => (
              <div key={index} className='flex flex-col space-y-2'>
                <h1 className="font-semibold">{cat.title}</h1>
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2'>
                  {cat.topics.map((topic) => (
                    <div
                      key={topic.topic_id}
                      onClick={() => handleSelect(topic)}
                      className={`px-2 py-1 rounded-full cursor-pointer flex justify-center max-w-[200px] transition 
                        ${safeTopicIds.includes(Number(topic.topic_id)) ? "bg-blue-600" : "bg-gray-500 hover:bg-gray-600"}`}
                    >
                      {topic.name}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onPrev} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 transition">Back</button>
          <button
            onClick={handleSubmit}
            disabled={safeTopicIds.length === 0}
            className={`${safeTopicIds.length === 0 ? "cursor-not-allowed bg-gray-700" : "bg-white hover:bg-white/60 text-black cursor-pointer"} px-4 py-2 rounded-md transition`}
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}

export default CommunitySelection;
