import React from "react";

export default function ProfileTabs({ activeTab, setActiveTab }) {
  return (
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
  );
}
