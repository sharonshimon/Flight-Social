import "./post.css";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { useState } from "react";
import LikeButton from "./likeButton";
import Comment from "./comment";
import postService from "../../services/postService";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Normalize post shape coming from backend or older demo data
  const poster = post.user || post.userId || {};
  // Use localStorage user info when this post belongs to the current user or when poster info is missing
  const localUser = (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  })();

  const isOwnPost = (() => {
    const storedId = localStorage.getItem('userId');
    const postUserId = typeof post.userId === 'string' ? post.userId : (poster._id || poster.id || post.userId || '');
    return storedId && postUserId && storedId === postUserId;
  })();

  const openEdit = () => {
    setEditContent(content || '');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditContent(content || '');
  };

  const submitEdit = async () => {
    setSubmittingEdit(true);
    try {
      const id = post._id || post.id;
      const fd = new FormData();
      fd.append('content', editContent || '');
      // Note: this minimal edit UI only updates text content. Media editing can be added later.
      const res = await postService.updatePost(id, fd);
      const updated = res?.post || res?.data || res;
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id, post: updated } }));
      setEditing(false);
    } catch (err) {
      console.error('Failed to update post', err);
      alert('Could not update post. See console for details.');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const name = (isOwnPost && localUser?.username) || poster.username || post.name || `${poster.firstName || ''} ${poster.lastName || ''}`.trim() || 'Unknown';
  const profilePic = (isOwnPost && (localUser?.profilePicture || localUser?.photoURL)) || poster.photoURL || post.profilePicture || post.profilePic || '';
  const content = post.content || post.desc || post.caption || '';
  const mediaUrl = Array.isArray(post.media) && post.media.length ? post.media[0].url : post.img || null;

  // Determine a safe user id for profile link
  const userIdForLink = typeof post.userId === 'string' ? post.userId : (poster._id || poster.id || post.userId || '');
  const anonymous = post.isAnonymous === true || post.isAnonymous === 'true';
  const displayName = anonymous ? 'Anonymous' : name;
  const displayPic = anonymous ? null : profilePic;

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            {displayPic ? <img src={displayPic} alt="" /> : <div style={{width:40,height:40,background:'#ddd',borderRadius:20}} />}
            <div className="details">
              {anonymous ? (
                <span className="name">{displayName}</span>
              ) : (
                <Link
                  to={`/profile/${userIdForLink}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">{displayName}</span>
                </Link>
              )}
              <span className="date">1 min ago</span>
            </div>
          </div>
          <MoreHorizIcon />
          {isOwnPost && (
            <div className="post-actions" style={{display:'flex',gap:8,alignItems:'center'}}>
              <button className="btn btn-link" onClick={openEdit} title="Edit post">Edit</button>
              <button className="btn btn-link" onClick={async () => {
                if (!window.confirm('Are you sure you want to delete this post?')) return;
                try {
                  const id = post._id || post.id;
                  await postService.deletePost(id);
                  window.dispatchEvent(new CustomEvent('post-deleted', { detail: { id } }));
                } catch (err) {
                  console.error('Failed to delete post', err);
                  alert('Could not delete post. See console for details.');
                }
              }} title="Delete post">Delete</button>
            </div>
          )}
        </div>
        <div className="content">
          <p>{content}</p>
          {mediaUrl && <img src={mediaUrl} alt="" />}
        </div>
        <div className="info">
          <LikeButton initialLikes={post.likes ? post.likes.length : 0} />
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Comments
          </div>
        </div>
  {commentOpen && <Comment postId={post._id || post.id || post.postId} initialComments={post.comments || []} />}
      </div>
    </div>
  );
};

export default Post;
