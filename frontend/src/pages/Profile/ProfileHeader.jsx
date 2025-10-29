import React from "react";
import { Edit, Share2 } from "lucide-react";

export default function ProfileHeader({
  user,
  onEditClick,
  onShareClick,
  onFollowersClick,
  onFollowingClick,
  isFollowing,
  onFollowToggle
}) {
  return (
    <div className="ig-header">
      <img className="ig-avatar" src={user.avatar} alt={`${user.username} avatar`} />

      <div className="ig-head-main">
        <div className="ig-username-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2 className="ig-username" style={{ fontSize: "1.6rem", fontWeight: "bold" }}>
            {user.username}
          </h2>
          {!onEditClick && onFollowToggle && (
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              color="primary"
              onClick={handleFollowToggle}
              sx={{ ml: 2 }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {user.name && (
          <div className="ig-fullname" style={{ fontSize: "1rem", fontWeight: 500, marginTop: "4px" }}>
            {user.name}
          </div>
        )}

        {user.bio && (
          <div className="ig-bio" style={{ marginTop: "6px" }}>
            <p style={{ margin: 0 }}>{user.bio}</p>
          </div>
        )}

        <ul className="ig-stats" style={{ marginTop: "10px" }}>
          <li><strong>{user.stats.posts}</strong> posts</li>
          <li onClick={onFollowersClick} style={{ cursor: "pointer", color: "#000" }}>
            <strong>{user.stats.followers}</strong> followers
          </li>
          <li onClick={onFollowingClick} style={{ cursor: "pointer", color: "#000" }}>
            <strong>{user.stats.following}</strong> following
          </li>
        </ul>

        <div className="ig-buttons" style={{ marginTop: "10px" }}>
          {onFollowToggle ? (
            <button className={`ig-btn ig-follow-btn`} onClick={onFollowToggle}>
              {isFollowing ? "Following" : "Follow"}
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
