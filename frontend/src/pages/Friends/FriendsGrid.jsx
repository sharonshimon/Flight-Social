import React from "react";
import BuddyCard from "../../components/buddies/BuddyCard";

export default function FriendsGrid({ friends }) {
  return (
    <div className="buddies__grid">
      {friends.map((b) => (
        <BuddyCard
          key={b.id}
          avatar={b.avatar}
          name={b.name}
          handle={b.handle}
          mutuals={b.mutuals}
        />
      ))}
    </div>
  );
}
