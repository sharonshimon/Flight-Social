import React from "react";

export default function LocationVisibility({
  location,
  setLocation,
  visibility,
  setVisibility,
}) {
  return (
    <div className="np-row">
      <label className="np-label">
        Location
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Bangkok, Thailand"
        />
      </label>

      <label className="np-label">
        Visibility
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="friends">Friends</option>
          <option value="private">Only me</option>
        </select>
      </label>
    </div>
  );
}
