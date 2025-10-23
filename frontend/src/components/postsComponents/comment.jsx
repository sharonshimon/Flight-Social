import React, { useEffect, useState } from "react";
import postService from "../../services/postService";
import defaultAvatar from '../../assets/photoplaceholder.jpg';

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
      alert("Could not update comment.");
    }
  };

  const handleDelete = async (comment) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const body = { commentId: comment.commentId, userId: currentUserId };
      const updatedPost = await postService.deleteCommentFromPost(postId, body);
      setComments(updatedPost.comments);
    } catch (err) {
      console.error("Failed to delete comment", err);
      alert("Could not delete comment.");
    }
  };

  const renderAvatar = (c) => {
    const avatarUrl = c.isAnonymous || !c.profilePicture ? defaultAvatar : c.profilePicture;
    return <img src={avatarUrl} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8, objectFit: 'cover' }} />;
  };

  const renderAuthor = (c) => c.isAnonymous ? "Anonymous" : c.username || "User";

  return (
    <div className="comments">
      <div className="comment-list">
        {comments.map((c) => (
          <div key={c.commentId} className="comment">
            <div className="comment-meta" style={{ display: "flex", alignItems: "center" }}>
              {renderAvatar(c)}
              <strong>{renderAuthor(c)}</strong>
              <span style={{ marginLeft: 8, fontSize: 12, color: "#555" }}>{new Date(c.createdAt).toLocaleString()}</span>
            </div>

            {editingCommentId === c.commentId ? (
              <div className="comment-edit">
                <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} style={{ width: "100%", marginTop: 4 }} />
                <div style={{ marginTop: 4 }}>
                  <button onClick={cancelEdit}>Cancel</button>
                  <button onClick={() => submitEdit(c)}>Save</button>
                </div>
              </div>
            ) : (
              <div className="comment-body"><p>{c.content}</p></div>
            )}

            {String(c.userId) === String(currentUserId) && editingCommentId !== c.commentId && (
              <div className="comment-actions" style={{ marginTop: 4 }}>
                <button onClick={() => startEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <form className="comment-input" onSubmit={handleCreate} style={{ marginTop: 8 }}>
        <input type="text" placeholder="Write a comment..." value={text} onChange={(e) => setText(e.target.value)} style={{ width: "70%", marginRight: 8 }} />
        <label style={{ marginRight: 8 }}>
          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} /> Anonymous
        </label>
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Comment;
