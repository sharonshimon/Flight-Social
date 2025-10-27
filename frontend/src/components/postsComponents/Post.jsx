import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import LikeButton from "./likeButton";
import Comment from "./comment";
import postService from "../../services/postService";
import groupService from "../../services/groupService";
import "./post.css";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);

  // fetch group info if post belongs to a group
  useEffect(() => {
    const fetchGroup = async () => {
      if (post.group && post.group !== "null" && post.group !== "") {
        try {
          const data = await groupService.getGroupById(post.group);
          if (data) setGroupInfo(data);
        } catch (err) {
          console.error("Error fetching group info:", err);
          setGroupInfo(null);
        }
      }
    };
    fetchGroup();
  }, [post.group]);

  // utility to format time ago
  const formatTimeAgo = (createdAt) => {
    if (!createdAt) return "";
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours < 1) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;

    const day = String(created.getDate()).padStart(2, "0");
    const month = String(created.getMonth() + 1).padStart(2, "0");
    const year = created.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // current user from local storage
  const localUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  })();

  // user who posted
  const poster = post.user || post.userId || {};

  // post ownership
  const storedId = localStorage.getItem("userId");
  const postUserId =
    typeof post.userId === "string"
      ? post.userId
      : poster._id || poster.id || post.userId || "";
  const isOwnPost = storedId && postUserId && storedId === postUserId;

  // post content
  const content = post.content || post.desc || post.caption || "";
  const tags = post.tags || [];

  // name and profile picture
  const name =
    (isOwnPost && localUser?.username) ||
    poster.username ||
    post.name ||
    `${poster.firstName || ""} ${poster.lastName || ""}`.trim() ||
    "Unknown";
  const profilePicture =
    (isOwnPost && (localUser?.profilePicture || localUser?.photoURL)) ||
    poster.profilePicture ||
    poster.photoURL ||
    "";

  // Get all media items
  const mediaItems = Array.isArray(post.media) && post.media.length
    ? post.media
    : post.img
      ? [{ url: post.img }]
      : [];

  const userIdForLink =
    typeof post.userId === "string"
      ? post.userId
      : poster._id || poster.id || post.userId || "";
  const anonymous = post.isAnonymous === true || post.isAnonymous === "true";
  const displayName = anonymous ? "Anonymous" : name;
  const displayPic = anonymous ? null : profilePicture;

  // edit handlers
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
              <div className="user-text-info">
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
                <span className="date">{formatTimeAgo(post.createdAt)}</span>
              </div>

              {groupInfo ? (
                <div className="group-info">
                  <span className="group-name">{groupInfo.name}</span>
                  <span className={`group-privacy ${groupInfo.privacy || "public"}`}>
                    {groupInfo.privacy === "private" ? "Private" : "Public"}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {isOwnPost && (
            <div className="post-actions">
              <button className="btn btn-link" onClick={openEdit} title="Edit post">
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
          {editing ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                style={{ width: "100%" }}
              />
              <div className="edit-buttons">
                <button onClick={cancelEdit}>Cancel</button>
                <button onClick={submitEdit} disabled={submittingEdit}>
                  {submittingEdit ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
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
                        {word}{" "}
                      </Link>
                    );
                  }
                  return word + " ";
                })}
              </p>
              {mediaItems.length > 0 && (
                <div className="media-gallery">
                  {mediaItems.map((media, index) => {
                    const isVideo = media.type === 'video' ||
                      media.url?.match(/\.(mp4|webm|ogg|mov)$/i);

                    if (isVideo) {
                      return (
                        <video
                          key={index}
                          controls
                          style={{
                            width: "100%",
                            maxHeight: "400px",
                            borderRadius: "10px",
                            marginTop: index === 0 ? "8px" : "4px",
                          }}
                        >
                          <source src={media.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      );
                    }

                    return (
                      <img
                        key={index}
                        src={media.url}
                        alt=""
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          marginTop: index === 0 ? "8px" : "4px",
                        }}
                      />
                    );
                  })}
                </div>
              )}
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
            </>
          )}
        </div>

        {/* ----------- Info ----------- */}
        <div className="info">
          <LikeButton
            initialLikes={post.likes?.length || 0}
            postId={post._id || post.id}
            postLikes={post.likes || []}
          />
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon /> Comments
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