import React from "react";
export default function BuddyCard({
  avatar,
  name,
  handle,
  mutuals,
  onClick, 
  rightSlot, 
}) {
  return (
    <div className="buddy card" onClick={onClick} role={onClick ? "button" : undefined}>
      <img className="buddy__avatar" src={avatar} alt={`${name} avatar`} />
      <div className="buddy__main">
        <div className="buddy__name">{name}</div>
        <div className="buddy__handle">{handle}</div>
        <div className="buddy__mutuals">{mutuals} mutual connections</div>
      </div>
      {rightSlot ? <div className="buddy__actions">{rightSlot}</div> : null}
    </div>
  );
}
