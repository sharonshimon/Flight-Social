import React from "react";
import { Edit, Share2 } from "lucide-react";

export default function ProfileHeader({ user, onEditClick, onShareClick, onFollowersClick, onFollowingClick, isFollowing, onFollowToggle }) {
  return (
    <div className="ig-header">
      <img className="ig-avatar" src={user.avatar} alt={`${user.username} avatar`} />
      <div className="ig-head-main">
        <div className="ig-username-row">
          <h2 className="ig-username">{user.username}</h2>
        </div>

        <ul className="ig-stats">
          <li><strong>{user.stats.posts}</strong> posts</li>
          <li onClick={onFollowersClick} style={{ cursor: 'pointer', color: '#000000ff' }}>
            <strong>{user.stats.followers}</strong> followers
          </li>
          <li onClick={onFollowingClick} style={{ cursor: 'pointer', color: '#000000ff' }}>
            <strong>{user.stats.following}</strong> following
          </li>
        </ul>

        <div className="ig-bio">
          <span className="ig-name">{user.name}</span>
          <p>{user.bio}</p>
        </div>

        <div className="ig-buttons">
          {onFollowToggle ? (
            <button className={`ig-btn ig-follow-btn`} onClick={onFollowToggle}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          ) : (
            <button className="ig-btn" onClick={onEditClick}>
              <Edit size={18} className="ig-btn-icon" /> Edit Profile
            </button>
          )}
          <button className="ig-btn" onClick={onShareClick}>
            <Share2 size={18} className="ig-btn-icon" /> Share Profile
          </button>
        </div>
      </div>
    </div>
  );
}
