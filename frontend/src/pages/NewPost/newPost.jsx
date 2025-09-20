import React, { useRef, useState } from "react";
import "./NewPost.css";

const MAX_CAPTION = 2200;

export default function NewPost() {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [files, setFiles] = useState([]);          // File[] (from input/drag)
  const [previews, setPreviews] = useState([]);    // object URLs for preview
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const onFilesPicked = (fileList) => {
    const arr = Array.from(fileList || []);
    if (!arr.length) return;

    // Filter to images/videos only
    const valid = arr.filter((f) =>
      /image\/|video\//.test(f.type)
    );

    // Generate previews
    const urls = valid.map((f) => URL.createObjectURL(f));

    // Append to existing
    setFiles((prev) => [...prev, ...valid]);
    setPreviews((prev) => [...prev, ...urls]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onFilesPicked(e.dataTransfer.files);
  };

  const onDeleteMedia = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => {
      // revoke the one we remove
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const canSubmit = caption.trim().length > 0 || files.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Build a payload you’d send to your API
    const formData = new FormData();
    formData.append("caption", caption.trim());
    formData.append("location", location.trim());
    formData.append("visibility", visibility);
    files.forEach((f, i) => formData.append("media", f, f.name || `media_${i}`));

    // TODO: POST to your backend
    // fetch("/api/posts", { method: "POST", body: formData })

    console.log("Submitting new post:", {
      caption,
      location,
      visibility,
      files,
    });

    // Reset
    setCaption("");
    setLocation("");
    setVisibility("public");
    setFiles([]);
    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews([]);
    alert("Post submitted (mock). Wire this to your API!");
  };

  return (
    <div className="newpost">
      <h2>Create New Post</h2>

      <form className="np-form" onSubmit={handleSubmit}>
        {/* Media picker */}
        <div
          className={`np-drop ${isDragging ? "is-dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={openPicker}
          role="button"
          aria-label="Add photos or videos"
          tabIndex={0}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={(e) => onFilesPicked(e.target.files)}
          />
          {previews.length === 0 ? (
            <div className="np-drop__empty">
              <div className="np-drop__icon">＋</div>
              <div className="np-drop__text">
                Drag & drop photos/videos here, or <span className="link">browse</span>
              </div>
              <div className="np-drop__hint">PNG, JPG, MP4 up to ~25MB each</div>
            </div>
          ) : (
            <div className="np-grid">
              {previews.map((src, i) => {
                const file = files[i];
                const isVideo = file?.type?.startsWith("video/");
                return (
                  <div className="np-grid__item" key={`${src}-${i}`}>
                    {isVideo ? (
                      <video src={src} controls preload="metadata" />
                    ) : (
                      <img src={src} alt={`media-${i}`} />
                    )}
                    <button
                      type="button"
                      className="np-grid__remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMedia(i);
                      }}
                      aria-label="Remove media"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                className="np-grid__addmore"
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
                aria-label="Add more"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Caption */}
        <label className="np-label">
          Caption
          <textarea
            value={caption}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CAPTION) {
                setCaption(e.target.value);
              }
            }}
            rows={4}
            placeholder="Write a caption…"
          />
          <div className="np-help">
            {caption.length}/{MAX_CAPTION}
          </div>
        </label>

        {/* Location & visibility */}
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
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option value="public">Public</option>
              <option value="friends">Friends</option>
              <option value="private">Only me</option>
            </select>
          </label>
        </div>

        <div className="np-actions">
          <button type="button" className="btn" onClick={() => window.history.back()}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={!canSubmit}>
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
