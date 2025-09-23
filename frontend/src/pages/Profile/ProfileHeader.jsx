import React from "react";

export default function ProfileHeader({ user }) {
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
      </div>
    </div>
  );
}
