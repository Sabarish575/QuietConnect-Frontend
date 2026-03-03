"use client";

import React, { useState } from 'react';
import CommunityCreation from './CommunityCreation';
import CommunitySelection from './CommunitySelection';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function CommunityWizard({ modal, setModal }) {
  const router = useRouter();

  const [step, setStep] = useState(1);

  // ✅ Always initialize as empty arrays
  const [title, setTitle] = useState(""); 
  const [desc, setDesc] = useState("");
  const [topicIds, setTopicIds] = useState([]);  // <-- renamed for clarity

  const handleClose = () => {
    // Reset wizard when closing modal
    setStep(1);
    setTitle("");
    setDesc("");
    setTopicIds([]);
    setModal(false);
  };

    const handleSubmit = async () => {
      if (title.trim() === "" || desc.trim() === "" || topicIds.length === 0) {
        toast.error("Please fill all fields and select at least 1 topic");
        return;
      }

      const communityDetails = {
        communityTitle: title,
        communityBio: desc,
        topicIds: topicIds
      };

      try {
        const res = await axios.post(
          "http://quietconnect-backend.onrender.com/api/community/create",
          communityDetails,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );

        toast.success("Community Created!");
        router.push(`communitypage/${res.data}`);

      } catch (err) {
        if (err.response?.status === 400) {
          toast.error("Community title already exists!");
        } else {
          toast.error("Failed to create community");
        }
      }

    };


  return (
    <>
      {step === 1 && 
        <CommunityCreation
          communityTitle={title}
          setCommunityTitle={setTitle}
          communityBio={desc}
          setCommunityBio={setDesc}
          onNext={() => setStep(2)}
          modal={modal}
          handleClose={handleClose}
        />
      }

      {step === 2 &&
        <CommunitySelection
          topicIds={topicIds}
          setTopicIds={setTopicIds}
          onPrev={() => setStep(1)}
          handleSubmit={handleSubmit}
          modal={modal}
          handleClose={handleClose}
        />
      }
    </>
  );
}

export default CommunityWizard;
