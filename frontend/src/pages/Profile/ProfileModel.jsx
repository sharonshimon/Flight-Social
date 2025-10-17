import React, { useState, useEffect } from "react";
import "./ProfileModel.css";
import LikeButton from "../../components/postsComponents/likeButton";
import Comment from "../../components/postsComponents/comment";
import postService from "../../services/postService";

export default function ProfileModal({ photo, onClose, post, canEdit = false }) {
  if (!photo || !post) return null;

  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(post.desc || "");
  const [submitting, setSubmitting] = useState(false);

  // Keep desc in sync if post prop changes
  useEffect(() => {
    setDesc(post.desc || "");
  }, [post]);

  const save = async () => {
    if (!canEdit) return;
    setSubmitting(true);
    try {
      const id = post.id || post._id || post.postId;
      if (!id) throw new Error("Post id missing");
      const fd = new FormData();
      fd.append('content', desc || '');
      // Use postService update (multipart/form-data)
  const updated = await postService.updatePost(id, fd);
      // Broadcast update for grid/feed
  window.dispatchEvent(new CustomEvent('post-updated', { detail: { id, post: updated } }));
      setEditing(false);
    } catch (err) {
      console.error('ProfileModal save failed', err);
      alert('Failed to save post. See console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = () => {
    if (!canEdit) return;
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDesc(post.desc || "");
  };

  return (
    <div className="ig-modal-overlay" onClick={onClose}>
      <div className="ig-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>

        {/* Left side: image */}
        <div className="ig-modal-image">
          <img src={photo} alt="Post" />
        </div>

        {/* Right side: details */}
        <div className="ig-modal-details">
          <div className="ig-modal-header">
            {post.isAnonymous ? (
              <>
                <div className="ig-user-pic" style={{width:40,height:40,borderRadius:20,background:'#ddd'}} />
                <span className="ig-user-name">Anonymous</span>
              </>
            ) : (
              <>
                <img src={post.profilePic} alt={post.name} className="ig-user-pic" />
                <span className="ig-user-name">{post.name}</span>
              </>
            )}
            {canEdit && !editing && (
              <button className="ig-edit-btn" onClick={startEdit}>Edit</button>
            )}
          </div>

          <div className="ig-modal-desc">
            {!editing ? (
              <p>{post.desc}</p>
            ) : (
              <div className="ig-edit-area">
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} />
                <div className="ig-edit-actions">
                  <button onClick={cancelEdit} disabled={submitting} className="btn">Cancel</button>
                  <button onClick={save} disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <LikeButton initialLikes={post.likes || 0} />

          <div className="ig-modal-comments">
            <Comment postId={post.id || post._id || post.postId} initialComments={post.comments || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
