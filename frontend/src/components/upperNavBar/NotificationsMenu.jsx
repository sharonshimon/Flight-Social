import React, { useEffect, useRef, useState } from "react";
import "./notifications.css";

const seed = [
  { id: "n1", avatar: "https://i.pravatar.cc/40?img=12", text: "Jane Doe liked your photo", time: "1m", unread: true },
  { id: "n2", avatar: "https://i.pravatar.cc/40?img=23", text: "Alex G. commented: “amazing shot!”", time: "5m", unread: true },
  { id: "n3", avatar: "https://i.pravatar.cc/40?img=31", text: "Ground Crew TLV invited you to join", time: "1h", unread: false },
  { id: "n4", avatar: "https://i.pravatar.cc/40?img=7",  text: "Maya L. started following you", time: "2h", unread: false },
];

export default function NotificationsMenu({ onClose }) {
  const ref = useRef(null);
  const [items, setItems] = useState(seed);

  useEffect(() => {
    const onDocClick = (e) => { if (!ref.current?.contains(e.target)) onClose?.(); };
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const unread = items.some(i => i.unread);
  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, unread: false })));

  return (
    <div className="notif-popover" ref={ref} role="dialog" aria-label="Notifications">
      <div className="notif-header">
        <span>Notifications{unread ? " • new" : ""}</span>
        <button className="link-btn" onClick={markAllRead}>Mark all read</button>
      </div>
      <div className="notif-list">
        {items.map(n => (
          <button key={n.id} className={`notif-item ${n.unread ? "is-unread" : ""}`}>
            <img src={n.avatar} alt="" className="notif-avatar" />
            <div className="notif-main">
              <div className="notif-text">{n.text}</div>
              <div className="notif-meta">{n.time} ago</div>
            </div>
          </button>
        ))}
        {!items.length && <div className="notif-empty">You’re all caught up 🎉</div>}
      </div>
    </div>
  );
}
