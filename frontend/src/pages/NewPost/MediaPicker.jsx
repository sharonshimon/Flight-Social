import React, { useState } from "react";

export default function MediaPicker({
  inputRef,
  files,
  previews,
  onFilesPicked,
  onDeleteMedia,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onFilesPicked(e.dataTransfer.files);
  };

  return (
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
  );
}
