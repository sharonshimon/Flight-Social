import React from "react";

export default function CaptionInput({ caption, setCaption, max }) {
  return (
    <label className="np-label">
      Caption
      <textarea
        value={caption}
        onChange={(e) => {
          if (e.target.value.length <= max) {
            setCaption(e.target.value);
          }
        }}
        rows={4}
        placeholder="Write a caption…"
      />
      <div className="np-help">
        {caption.length}/{max}
      </div>
    </label>
  );
}
