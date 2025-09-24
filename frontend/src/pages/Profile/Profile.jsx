import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";
import ProfileModal from "./ProfileModel";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileGrid from "./ProfileGrid";
import ProfileEmpty from "./ProfileEmpty";

const samplePosts = [
  {
    id: "p1",
    src: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1000&auto=format&fit=crop",
    desc: "Sunrise over Phi Phi 🏝️",
    likes: 128,
    comments: [
      { id: "c1", author: "Mia", text: "Insane colors!", at: "2h" },
      { id: "c2", author: "Alex", text: "Wish I was there 😍", at: "1h" },
    ],
  },
  {
    id: "p2",
    src: "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=1000&auto=format&fit=crop",
    desc: "Bangkok street food tour 🍜",
    likes: 89,
    comments: [{ id: "c1", author: "Dana", text: "Pad thai pls!", at: "3h" }],
  },
  {
    id: "p3",
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop",
    desc: "Golden hour at the temple ✨",
    likes: 207,
    comments: [],
  },
  {
    id: "p4",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    desc: "Island hop! 🛥️",
    likes: 64,
    comments: [{ id: "c1", author: "Rina", text: "Save me a seat!", at: "5h" }],
  },
  {
    id: "p5",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop",
    desc: "Cloud surfing en route ⛅",
    likes: 151,
    comments: [{ id: "c1", author: "Maya", text: "Pilot vibes!", at: "1d" }],
  },
];

export default function Profile() {
  const params = useParams();
  const userId = params.id ?? "me";
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);

  // Fallback user (memoized so it doesn’t recreate on every render)
  const fallbackUser = useMemo(
    () => ({
      username: "aviator",
      name: "Aviator",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Thailand Addict!!!!!",
      stats: { posts: 42, followers: 318, following: 180 },
      posts: samplePosts,
    }),
    []
  );

  // Try getting logged-in user
  let currentUser = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      currentUser = {
        username: userObj.username || userObj.firstName || "User",
        name: userObj.firstName +" "+ userObj.lastName || "User",
        avatar:
          userObj.profilePicture ||
          "https://randomuser.me/api/portraits/men/32.jpg",
        bio: userObj.bio,
        stats: { posts: 42, followers: 318, following: 180 },
        posts: samplePosts,
      };
    }
  } catch (e) {
    console.error("Error parsing localStorage user:", e);
  }

  if (!currentUser) currentUser = fallbackUser;

  return (
    <div className="ig-profile">
      <ProfileHeader user={currentUser} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "posts" && (
        <ProfileGrid posts={currentUser.posts} onPostClick={setSelectedPost} />
      )}
      {activeTab === "reels" && <ProfileEmpty text="No reels yet" />}
      {activeTab === "tagged" && (
        <ProfileEmpty text="Photos of you will appear here" />
      )}

      {selectedPost && (
        <ProfileModal
          photo={selectedPost.src}
          onClose={() => setSelectedPost(null)}
          post={{
            profilePic: currentUser.avatar,
            name: currentUser.name,
            desc: selectedPost.desc,
            likes: selectedPost.likes,
            comments: selectedPost.comments,
          }}
        />
      )}
    </div>
  );
}
