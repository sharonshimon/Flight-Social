import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Share2 } from "lucide-react";


export default function ProfileHeader({ user, onEditClick, onShareClick }) {
  return (
    <div className="ig-header">
      <img
        className="ig-avatar"
        src={user.avatar}
        alt={`${user.username} avatar`}
      />
      <div className="ig-head-main">
        <div className="ig-username-row">
          <h2 className="ig-username">{user.username}</h2>
        </div>

        <ul className="ig-stats">
          <li>
            <strong>{user.stats.posts}</strong> posts
          </li>
          <li>
            <strong>{user.stats.followers}</strong> followers
          </li>
          <li>
            <strong>{user.stats.following}</strong> following
          </li>
        </ul>

        <div className="ig-bio">
          <span className="ig-name">{user.name}</span>
          <p>{user.bio}</p>
        </div>

        <div className="ig-buttons">
          <button className="ig-btn" onClick={onEditClick}>
            <Edit size={18} className="ig-btn-icon" />
            Edit Profile
          </button>

          <button className="ig-btn" onClick={onShareClick}>
            <Share2 size={18} className="ig-btn-icon" />
            Share Profile
          </button>
        </div>


      </div>
    </div>
  );
}
