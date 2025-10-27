import React from "react";
import BuddyCard from "../../components/buddies/BuddyCard";

export default function FriendsGrid({ friends, onUserClick }) {
  return (
    <div className="buddies__grid">
      {friends.map((b) => (
        <BuddyCard
          key={b.id}
          avatar={b.avatar}
          name={b.name}
          mutuals={b.mutuals}
          onClick={() => onUserClick(b.id)}
        />
      ))}
    </div>
  );
}
