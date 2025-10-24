import React from "react";
import defaultImage from '../../assets/photoplaceholder.jpg';

export default function ProfileGrid({ posts, onPostClick }) {
  return (
    <div className="ig-grid">
      {posts.map((post) => (
        <button
          key={post.id || post._id}
          className="ig-grid-item"
          aria-label={`Open post ${post.id || post._id}`}
          onClick={() => onPostClick?.(post)}
          type="button"
        >
          <img
            src={post.src || defaultImage}
            alt={post.desc || "Unknown post"}
          />
        </button>
      ))}
    </div>
  );
}
