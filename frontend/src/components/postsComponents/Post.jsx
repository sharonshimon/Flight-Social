

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

  // Normalize post shape
  const poster = post.user || post.userId || {};
  const localUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  })();

  const storedId = localStorage.getItem("userId");
  const postUserId =
    typeof post.userId === "string"
      ? post.userId
      : poster._id || poster.id || post.userId || "";
  const isOwnPost = storedId && postUserId && storedId === postUserId;

  // --- הגדרות עיקריות של הפוסט ---
  const content = post.content || post.desc || post.caption || "";
  const tags = post.tags || [];
  const name =
    (isOwnPost && localUser?.username) ||
    poster.username ||
    post.name ||
    `${poster.firstName || ""} ${poster.lastName || ""}`.trim() ||
    "Unknown";
  const profilePic =
    (isOwnPost &&
      (localUser?.profilePicture || localUser?.photoURL)) ||
    poster.photoURL ||
    post.profilePicture ||
    post.profilePic ||
    "";
  const mediaUrl =
    Array.isArray(post.media) && post.media.length
      ? post.media[0].url
      : post.img || null;

  const userIdForLink =
    typeof post.userId === "string"
      ? post.userId
      : poster._id || poster.id || post.userId || "";
  const anonymous =
    post.isAnonymous === true || post.isAnonymous === "true";
  const displayName = anonymous ? "Anonymous" : name;
  const displayPic = anonymous ? null : profilePic;

  // --- עריכה ---
  const openEdit = () => {
    setEditContent(content || "");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditContent(content || "");
  };

  const submitEdit = async () => {
    setSubmittingEdit(true);
    try {
      const id = post._id || post.id;
      const fd = new FormData();
      fd.append("content", editContent || "");
      const res = await postService.updatePost(id, fd);
      const updated = res?.post || res?.data || res;
      window.dispatchEvent(
        new CustomEvent("post-updated", { detail: { id, post: updated } })
      );
      setEditing(false);
    } catch (err) {
      console.error("Failed to update post", err);
      alert("Could not update post. See console for details.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <div className="post">
      <div className="container">
        {/* ----------- Header ----------- */}
        <div className="user">
          <div className="userInfo">
            {displayPic ? (
              <img src={displayPic} alt="" />
            ) : (
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#ddd",
                  borderRadius: 20,
                }}
              />
            )}
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
            <div
              className="post-actions"
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <button
                className="btn btn-link"
                onClick={openEdit}
                title="Edit post"
              >
                Edit
              </button>
              <button
                className="btn btn-link"
                onClick={async () => {
                  if (!window.confirm("Are you sure you want to delete this post?"))
                    return;
                  try {
                    const id = post._id || post.id;
                    await postService.deletePost(id);
                    window.dispatchEvent(
                      new CustomEvent("post-deleted", { detail: { id } })
                    );
                  } catch (err) {
                    console.error("Failed to delete post", err);
                    alert("Could not delete post. See console for details.");
                  }
                }}
                title="Delete post"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* ----------- Content ----------- */}
        <div className="content">
          <p>
            {content.split(/\s+/).map((word, index) => {
              if (word.startsWith("#")) {
                const cleanTag = word.replace(/[.,!?]$/, "").substring(1);
                return (
                  <Link
                    key={index}
                    to={`/posts?tag=${encodeURIComponent(cleanTag)}`}
                    className="tag-link"
                  >
                    {word}
                  </Link>
                );
              }
              return word + " ";
            })}
          </p>

          {mediaUrl && (
            <img
              src={mediaUrl}
              alt=""
              style={{
                width: "100%",
                borderRadius: "10px",
                marginTop: "8px",
              }}
            />
          )}

          {/* תגיות מובנות */}
          {tags.length > 0 && (
            <div className="tags">
              {tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/posts?tag=${encodeURIComponent(tag)}`}
                  className="tag-bubble"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ----------- Info ----------- */}
        <div className="info">
          <LikeButton initialLikes={post.likes ? post.likes.length : 0} />
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Comments
          </div>
        </div>

        {commentOpen && (
          <Comment
            postId={post._id || post.id || post.postId}
            initialComments={post.comments || []}
          />
        )}
      </div>
    </div>
  );
};

export default Post;
