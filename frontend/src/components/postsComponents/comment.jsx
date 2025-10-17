import React, { useEffect, useState } from "react";
import postService from "../../services/postService";

const Comment = ({ postId, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    // Only update local comments state when incoming comments actually changed
    setComments(prev => {
      const prevIds = (prev || []).map(c => c.commentId || c._id || c.id).join(',');
      const newIds = (initialComments || []).map(c => c.commentId || c._id || c.id).join(',');
      if (prevIds === newIds) return prev;
      return initialComments || [];
    });
  }, [initialComments]);

  const currentUserId = localStorage.getItem('userId');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const body = { content: text.trim(), isAnonymous, userId: currentUserId };
      const updatedPost = await postService.createComment(postId, body);
      // updatedPost should be the post object with comments
      setComments(updatedPost?.comments || []);
      setText("");
      setIsAnonymous(false);
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id: postId, post: updatedPost } }));
    } catch (err) {
      console.error('Failed to create comment', err);
      alert('Could not post comment. See console for details.');
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
      const body = { commentId: comment.commentId, content: editingText.trim(), userId: currentUserId };
      const updatedPost = await postService.updateComment(postId, body);
      setComments(updatedPost?.comments || []);
      setEditingCommentId(null);
      setEditingText("");
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id: postId, post: updatedPost } }));
    } catch (err) {
      console.error('Failed to update comment', err);
      alert('Could not update comment. See console for details.');
    }
  };

  const handleDelete = async (comment) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const body = { commentId: comment.commentId, userId: currentUserId };
      const updatedPost = await postService.deleteComment(postId, body);
      setComments(updatedPost?.comments || []);
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id: postId, post: updatedPost } }));
    } catch (err) {
      console.error('Failed to delete comment', err);
      alert('Could not delete comment. See console for details.');
    }
  };

  const renderAuthor = (c) => {
    if (c.isAnonymous) return 'Anonymous';
    if (c.username) return c.username;
    // c.userId may be object or id
    return c.userId?.username || c.userId || 'User';
  };

  return (
    <div className="comments">
      <div className="comment-list">
        {comments.map((c) => (
          <div key={c.commentId || c._id || c.id} className="comment">
            <div className="comment-meta">
              <strong>{renderAuthor(c)}</strong>
              <span className="comment-time">{new Date(c.createdAt).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            {editingCommentId === c.commentId ? (
              <div className="comment-edit">
                <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                <div>
                  <button onClick={cancelEdit}>Cancel</button>
                  <button onClick={() => submitEdit(c)}>Save</button>
                </div>
              </div>
            ) : (
              <div className="comment-body">
                <p>{c.content}</p>
              </div>
            )}
            <div className="comment-actions">
              {String(c.userId) === String(currentUserId) && editingCommentId !== c.commentId && (
                <>
                  <button onClick={() => startEdit(c)}>Edit</button>
                  <button onClick={() => handleDelete(c)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <form className="comment-input" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label style={{marginLeft:8}}>
          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} /> Post anonymously
        </label>
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Comment;
