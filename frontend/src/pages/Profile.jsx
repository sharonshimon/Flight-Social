import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const params = useParams();
  const userId = params.id ?? "me"; // still supports /profile/:id if you ever need it
  const [activeTab, setActiveTab] = useState("posts"); // posts | reels | tagged

  const user = useMemo(() => ({
    id: "me",
    username: "aviator",
    name: "Aviator",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Thailand Addict!!!!!",
    stats: { posts: 42, followers: 318, following: 180 },
    photos: ["/thailandPictures/thailand1.jpg",
      "/thailandPictures/thailand2.jpg",
      "/thailandPictures/thailand3.jpg",
      "/thailandPictures/thailand4.jpg",
      "/thailandPictures/thailand5.jpg",
      "/thailandPictures/thailand6.jpg",
      "/thailandPictures/thailand7.jpg",
    ],
  }), []);

  const isMe = userId === "me";

  return (
    <div className="ig-profile">
      <div className="ig-header">
        <img className="ig-avatar" src={user.avatar} alt={`${user.username} avatar`} />
        <div className="ig-head-main">
          <div className="ig-username-row">
            <h2 className="ig-username">{user.username}</h2>
          </div>

          <ul className="ig-stats">
            <li><strong>{user.stats.posts}</strong> posts</li>
            <li><strong>{user.stats.followers}</strong> followers</li>
            <li><strong>{user.stats.following}</strong> following</li>
          </ul>

          <div className="ig-bio">
            <span className="ig-name">{user.name}</span>
            <p>{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="ig-tabs">
        <button
          className={`ig-tab ${activeTab === "posts" ? "is-active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          POSTS
        </button>
        <button
          className={`ig-tab ${activeTab === "reels" ? "is-active" : ""}`}
          onClick={() => setActiveTab("reels")}
        >
          REELS
        </button>
        <button
          className={`ig-tab ${activeTab === "tagged" ? "is-active" : ""}`}
          onClick={() => setActiveTab("tagged")}
        >
          TAGGED
        </button>
      </div>

      {/* Content */}
      {activeTab === "posts" && (
        <div className="ig-grid">
          {user.photos.map((src, i) => (
            <button key={i} className="ig-grid-item" aria-label={`Open post ${i + 1}`}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      {activeTab === "reels" && (
        <div className="ig-empty">
          <p>No reels yet</p>
        </div>
      )}

      {activeTab === "tagged" && (
        <div className="ig-empty">
          <p>Photos of you will appear here</p>
        </div>
      )}
    </div>
  );
}
