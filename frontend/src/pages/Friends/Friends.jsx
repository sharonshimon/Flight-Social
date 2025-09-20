import React, { useMemo, useState } from "react";
import "./Friends.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BuddyCard from "../../components/buddies/BuddyCard";

const seedBuddies = [
  { id: "u1", name: "Mia Cohen",        handle: "@miac",   avatar: "https://i.pravatar.cc/120?img=11", mutuals: 6, status: "friend" },
  { id: "u2", name: "Alex G.",          handle: "@alexg",  avatar: "https://i.pravatar.cc/120?img=5",  mutuals: 2, status: "friend" },
  { id: "u6", name: "Noam K.",          handle: "@noamk",  avatar: "https://i.pravatar.cc/120?img=24", mutuals: 9, status: "friend" },
  { id: "u7", name: "Maya L.",          handle: "@mayal",  avatar: "https://i.pravatar.cc/120?img=12", mutuals: 7, status: "friend" },
  { id: "u8", name: "Ground Crew TLV",  handle: "@ground", avatar: "https://i.pravatar.cc/120?img=15", mutuals: 8, status: "friend" },
  { id: "u9", name: "Tower Ops",        handle: "@tower",  avatar: "https://i.pravatar.cc/120?img=22", mutuals: 2, status: "friend" },
  // (requests/suggestions omitted since you said "only friends")
];

export default function Friends() {
  const [query, setQuery] = useState("");

  const friends = useMemo(
    () => seedBuddies.filter((b) => b.status === "friend"),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (b) => b.name.toLowerCase().includes(q) || b.handle.toLowerCase().includes(q)
    );
  }, [friends, query]);

  return (
    <div className="buddies">
      {/* Header + Search */}
      <div className="buddies__top">
        <h2>Flight Buddies</h2>
        <div className="buddies__search">
          <SearchOutlinedIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buddies"
          />
        </div>
      </div>

      {/* Friends grid */}
      <div className="buddies__grid">
        {filtered.map((b) => (
          <BuddyCard
            key={b.id}
            avatar={b.avatar}
            name={b.name}
            handle={b.handle}
            mutuals={b.mutuals}
          />
        ))}

        {filtered.length === 0 && (
          <div className="buddies__empty">
            No friends found{query ? ` for “${query}”` : ""}.
          </div>
        )}
      </div>
    </div>
  );
}
