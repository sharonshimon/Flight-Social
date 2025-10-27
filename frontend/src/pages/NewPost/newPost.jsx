import React, { useRef, useState, useEffect } from "react";
import "./NewPost.css";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";
import { useNavigate } from "react-router-dom";
import MediaPicker from "./MediaPicker";
import CaptionInput from "./CaptionInput";
import LocationVisibility from "./LocationVisibility";
import FormActions from "./FormActions";

const MAX_CAPTION = 2200;

export default function NewPost() {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    const formData = new FormData();
    formData.append("content", caption.trim());
    formData.append("isAnonymous", isAnonymous ? 'true' : 'false');
    // append tags as JSON string or multiple entries
    if (selectedTags && selectedTags.length) {
      // append each tag separately so server receives multiple entries
      selectedTags.forEach(t => formData.append('tags', t));
    }
    if (selectedGroup) formData.append('group', selectedGroup);
    formData.append("location", location.trim());
    formData.append("privacy", visibility);
    // append files under key 'media' because server parser.array('media') expects that
    files.forEach((f, i) => formData.append("media", f, f.name || `media_${i}`));

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Backend route: POST /api/v1/posts/create-post
      const url = `${API_ENDPOINTS.posts.create.replace(/\/$/, '')}/create-post`;
      // debug
      const token = localStorage.getItem('token');
      console.debug('NewPost.submit -> URL:', url, 'token present:', !!token);
      // Do NOT set Content-Type manually for multipart/form-data; browser will add the correct boundary
      const res = await axiosInstance.post(url, formData);

      console.log('Post created:', res.data);
      // log the created post object if present
      console.debug('NewPost created post detail:', res.data?.data || res.data);

      // Reset form
      setCaption("");
      setLocation("");
      setVisibility("public");
      setFiles([]);
      previews.forEach((u) => URL.revokeObjectURL(u));
      setPreviews([]);

      // Optionally navigate to feed or show success
      alert(res.data?.message || 'Post created successfully');
      // notify other parts of the app that a new post was created
      try { window.dispatchEvent(new CustomEvent('post-created', { detail: res.data?.data })); } catch (e) { console.debug('dispatch event failed', e); }
      // navigate to feed so user can see the new post
      navigate('/feed');
    } catch (err) {
      console.error('Create post error:', err.response?.data || err.message);
      setSubmitError(err.response?.data?.message || err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const loadGroups = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.groups.getAllGroups);
        if (cancelled) return;
        const groupsArray = res.data?.groups || [];
        setAvailableGroups(groupsArray);
        console.log('Groups loaded:', groupsArray);
      } catch (err) {
        console.error('Failed to load groups', err?.response?.data || err.message);
      }
    };
    loadGroups();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="newpost">
      <h2>Create New Post</h2>
      <form className="np-form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} /> Post anonymously
          </label>
        </div>

        <div className="tags-container">
          <label>Tags:</label>
          <div className="tags-options" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
            {[
              "Adventure", "CityTrip", "Nature", "Luxury", "Backpacking", "FoodAndDrink",
              "Cultural", "Family", "Couples", "SoloTravel", "Budget", "Wellness", "RoadTrip", "Festival",
              "Historical", "Beach", "Mountain", "Wildlife", "Cruise", "Skiing", "Hiking", "Camping",
              "Diving", "Surfing", "Cycling", "Photography", "Shopping", "Nightlife", "General", "Other"
            ].map(tag => (
              <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags([...selectedTags, tag]);
                    } else {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    }
                  }}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <div className="single-select-container">
          <label>Group (optional): </label>
          <select
            className="single-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">-- none --</option>
            {availableGroups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

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
        {submitError && <div style={{ color: 'red' }}>{submitError}</div>}
        <FormActions canSubmit={canSubmit} submitting={submitting} />
      </form>
    </div>
  );
}
