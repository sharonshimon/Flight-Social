import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function FriendsHeader({ query, setQuery }) {
  return (
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
  );
}
