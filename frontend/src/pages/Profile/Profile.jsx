import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import postService from "../../services/postService";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";
import "./Profile.css";
import ProfileModal from "./ProfileModel";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileGrid from "./ProfileGrid";
import ProfileEmpty from "./ProfileEmpty";
import FollowersModal from "./FollowersModal";

export default function Profile() {
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.id ?? "me";

  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [profilePosts, setProfilePosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);

  const [followersModal, setFollowersModal] = useState(null);

  const storedUserId = localStorage.getItem("userId");
  const isOwnProfile = userId === "me" || storedUserId === userId;

  const refreshFullProfile = async () => {
    try {
      const idToFetch = userId === "me" ? storedUserId : userId;
      if (!idToFetch) return;

      setPostsLoading(true);

      // --- Get user info ---
      const resUser = await axiosInstance.get(API_ENDPOINTS.users.getById(idToFetch));
      const userInfo = resUser.data?.userInfo;
      if (!userInfo) return;

      // --- Get posts by userId using the new service method ---
      const userPosts = await postService.getPostsByUserId(userInfo._id);

      const gridItems = userPosts.map(p => ({
        id: p._id || p.postId || p.id,
        src: Array.isArray(p.media) && p.media.length ? p.media[0].url : p.img || p.src || "",
        desc: p.content || p.desc || "",
        likes: p.likes ? p.likes.length : 0,
        comments: p.comments || []
      }));

      setProfilePosts(gridItems);

      // --- Set profile data ---
      setProfileUser({
        _id: userInfo._id,
        username: userInfo.username || "User",
        name: `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() || "User",
        avatar: userInfo.profilePicture || "",
        bio: userInfo.bio || "",
        stats: {
          posts: gridItems.length,
          followers: Array.isArray(userInfo.followers) ? userInfo.followers.length : 0,
          following: Array.isArray(userInfo.followings) ? userInfo.followings.length : 0
        }
      });

    } catch (err) {
      console.error("Failed to refresh full profile:", err);
      setPostsError(err.response?.data?.message || err.message || "Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    refreshFullProfile();
  }, [userId]);

  const onEditClick = () => {
    if (isOwnProfile) navigate("/edit-profile");
    else alert("You do not have permission to edit this profile");
  };

  const onShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard");
    } catch {
      alert("Unable to copy the profile link");
    }
  };

  if (!profileUser) return <div>Loading profile...</div>;

  return (
    <div className="ig-profile">
      <ProfileHeader
        user={profileUser}
        onEditClick={onEditClick}
        onShareClick={onShareClick}
        onFollowersClick={() => setFollowersModal({ type: "followers" })}
        onFollowingClick={() => setFollowersModal({ type: "following" })}
      />

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "posts" && (
        postsLoading
          ? <div>Loading posts...</div>
          : postsError
            ? <div style={{ color: "red" }}>Error loading posts: {postsError}</div>
            : <ProfileGrid posts={profilePosts} onPostClick={setSelectedPost} />
      )}

      {activeTab === "reels" && <ProfileEmpty text="No reels yet" />}
      {activeTab === "tagged" && <ProfileEmpty text="Photos of you will appear here" />}

      {selectedPost && (
        <ProfileModal
          photo={selectedPost.src}
          onClose={() => setSelectedPost(null)}
          post={{
            id: selectedPost.id,
            profilePic: profileUser.avatar,
            name: profileUser.name,
            desc: selectedPost.desc,
            likes: selectedPost.likes,
            comments: selectedPost.comments,
          }}
          canEdit={isOwnProfile}
        />
      )}

      {followersModal && (
        <FollowersModal
          userId={profileUser._id}
          type={followersModal.type}
          onClose={() => setFollowersModal(null)}
        />
      )}
    </div>
  );
}
