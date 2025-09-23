import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";
import ProfileModal from "./ProfileModel";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileGrid from "./ProfileGrid";
import ProfileEmpty from "./ProfileEmpty";

export default function Profile() {
  const params = useParams();
  const userId = params.id ?? "me";
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPhoto, setSelectedPhoto] = useState(null);


  const user = useMemo(
    () => ({
      id: "me",
      username: "aviator",
      name: "Aviator",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Thailand Addict!!!!!",
      stats: { posts: 42, followers: 318, following: 180 },
      photos: [
        "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop",
      ],
    }),
    []
  );

  return (
    <div className="ig-profile">
      <ProfileHeader user={user} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "posts" && (
        <ProfileGrid photos={user.photos} onPhotoClick={setSelectedPhoto} />
      )}
      {activeTab === "reels" && <ProfileEmpty text="No reels yet" />}
      {activeTab === "tagged" && (
        <ProfileEmpty text="Photos of you will appear here" />
      )}
      {selectedPhoto && (
        <ProfileModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          post={{
            profilePic: user.avatar,
            name: user.name,
            desc: "Chilling in Thailand 🏝️",
            likes: 25
          }}
        />
      )}
    </div>
  );
}
