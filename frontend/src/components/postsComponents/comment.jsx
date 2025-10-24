import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import postService from "../../services/postService";
import defaultAvatar from '../../assets/photoplaceholder.jpg';
import './comment.css';

const Comment = ({ postId, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Create a new comment
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const body = { content: text.trim(), isAnonymous, userId: currentUserId };
      const updatedPost = await postService.addComment(postId, body);
      setComments(updatedPost.comments);
      setText("");
      setIsAnonymous(false);
    } catch (err) {
      console.error("Failed to create comment", err);
      alert("Could not post comment.");
    }
  };

  // Edit a comment
  const startEdit = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditingText(comment.content);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const submitEdit = async (comment) => {
    if (!editingText.trim()) return;
    try {
      const body = { commentId: comment.commentId, content: editingText, userId: currentUserId };
      const updatedPost = await postService.updateComment(postId, body);
      setComments(updatedPost.comments);
      setEditingCommentId(null);
      setEditingText("");
    } catch (err) {
      console.error("Failed to update comment", err);
      alert(err.response?.data?.message || "Could not update comment.");
    }
  };

  // Delete a comment
  const handleDelete = async (comment) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const body = { commentId: comment.commentId, userId: currentUserId };
      const updatedPost = await postService.deleteCommentFromPost(postId, body);
      setComments(updatedPost.comments);
    } catch (err) {
      console.error("Failed to delete comment", err);
      alert(err.response?.data?.message || "Could not delete comment.");
    }
  };

  // --- HELPERS ---
  const renderAvatar = (c) => {
    const avatarUrl = c.username === "Anonymous" || !c.profilePicture ? defaultAvatar : c.profilePicture;
    return <img src={avatarUrl} alt="avatar" className="comment-avatar" />;
  };

  const isCommentOwner = (c) => {
    if (c.username === "Anonymous") return false;
    return String(c.userId) === String(currentUserId);
  };

  // --- RENDER ---
  return (
    <div className="comments">
      <div className="comment-list">
        {comments.map((c) => (
          <div key={c.commentId} className="comment">
            <div className="comment-meta" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {renderAvatar(c)}
                {c.username === "Anonymous" ? (
                  <strong>{c.username}</strong>
                ) : (
                  <Link
                    to={`/profile/${c.userId}`}
                    style={{ fontWeight: "bold", textDecoration: "none", color: "#000", marginRight: 8 }}
                  >
                    {c.username}
                  </Link>
                )}
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleString("he-IL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(/\//g, ".")}
                </span>
              </div>

              {isCommentOwner(c) && editingCommentId !== c.commentId && (
                <div className="comment-actions">
                  <button className="btn btn-link" onClick={() => startEdit(c)} title="Edit comment">Edit</button>
                  <button className="btn btn-link" onClick={() => handleDelete(c)} title="Delete comment">Delete</button>
                </div>
              )}
            </div>

            {editingCommentId === c.commentId ? (
              <div className="comment-edit">
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="comment-textarea"
                />
                <div className="comment-edit-actions">
                  <button className="btn btn-link" onClick={cancelEdit}>Cancel</button>
                  <button className="btn btn-link" onClick={() => submitEdit(c)}>Save</button>
                </div>
              </div>
            ) : (
              <div className="comment-body"><p>{c.content}</p></div>
            )}
          </div>
        ))}
      </div>

      <form className="comment-input" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="comment-input-text"
        />
        <label className="comment-anon-label">
          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} /> Anonymous
        </label>
        <button type="submit" className="btn btn-link">Post</button>
      </form>
    </div>
  );
};

export default Comment;
