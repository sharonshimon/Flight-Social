import React from "react";
import "./ProfileModel.css";
import LikeButton from "../../components/postsComponents/likeButton";
import Comment from "../../components/postsComponents/comment";

export default function ProfileModal({ photo, onClose, post }) {
  if (!photo) return null;

  return (
    <div className="ig-modal-overlay" onClick={onClose}>
      <div
        className="ig-modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <button className="close-btn" onClick={onClose}>✖</button>
        {/* Left side: smaller image */}
        <div className="ig-modal-image">
          <img src={photo} alt="Post" />
        </div>

        {/* Right side: scrollable info */}
        <div className="ig-modal-details">
          <div className="ig-modal-header">
            <img src={post.profilePic} alt={post.name} className="ig-user-pic" />
            <span className="ig-user-name">{post.name}</span>
          </div>

          <div className="ig-modal-desc">
            <p>{post.desc}</p>
          </div>

          <LikeButton initialLikes={post.likes || 0} />

          <div className="ig-modal-comments">
            <Comment />
          </div>
        </div>
      </div>
    </div>
  );
}
