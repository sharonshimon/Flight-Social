import React, { useRef, useState } from "react";
import "./NewPost.css";
import MediaPicker from "./MediaPicker";
import CaptionInput from "./CaptionInput";
import LocationVisibility from "./LocationVisibility";
import FormActions from "./FormActions";

const MAX_CAPTION = 2200;

export default function NewPost() {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const inputRef = useRef(null);

  const onFilesPicked = (fileList) => {
    const arr = Array.from(fileList || []);
    if (!arr.length) return;

    const valid = arr.filter((f) => /image\/|video\//.test(f.type));
    const urls = valid.map((f) => URL.createObjectURL(f));

    setFiles((prev) => [...prev, ...valid]);
    setPreviews((prev) => [...prev, ...urls]);
  };

  const onDeleteMedia = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const canSubmit = caption.trim().length > 0 || files.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const formData = new FormData();
    formData.append("caption", caption.trim());
    formData.append("location", location.trim());
    formData.append("visibility", visibility);
    files.forEach((f, i) => formData.append("media", f, f.name || `media_${i}`));

    console.log("Submitting new post:", {
      caption,
      location,
      visibility,
      files,
    });

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
        <MediaPicker
          inputRef={inputRef}
          files={files}
          previews={previews}
          onFilesPicked={onFilesPicked}
          onDeleteMedia={onDeleteMedia}
        />
        <CaptionInput
          caption={caption}
          setCaption={setCaption}
          max={MAX_CAPTION}
        />
        <LocationVisibility
          location={location}
          setLocation={setLocation}
          visibility={visibility}
          setVisibility={setVisibility}
        />
        <FormActions canSubmit={canSubmit} />
      </form>
    </div>
  );
}
