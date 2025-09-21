import React from "react";

export default function FriendsEmpty({ query }) {
  return (
    <div className="buddies__empty">
      No friends found{query ? ` for “${query}”` : ""}.
    </div>
  );
}
