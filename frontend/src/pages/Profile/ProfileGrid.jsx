import React from "react";

export default function ProfileGrid({ photos }) {
  return (
    <div className="ig-grid">
      {photos.map((src, i) => (
        <button
          key={i}
          className="ig-grid-item"
          aria-label={`Open post ${i + 1}`}
        >
          <img src={src} alt="" />
        </button>
      ))}
    </div>
  );
}
