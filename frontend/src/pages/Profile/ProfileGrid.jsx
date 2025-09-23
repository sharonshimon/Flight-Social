import React from "react";

export default function ProfileGrid({ posts, onPostClick }) {
  return (
    <div className="ig-grid">
      {posts.map((post) => (
        <button
          key={post.id}
          className="ig-grid-item"
          aria-label={`Open post ${post.id}`}
          onClick={() => onPostClick?.(post)}
          type="button"
        >
          <img src={post.src} alt={post.desc || "post"} />
        </button>
      ))}
    </div>
  );
}
