import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";
import "./Profile.css";
import ProfileModal from "./ProfileModel";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileGrid from "./ProfileGrid";
import ProfileEmpty from "./ProfileEmpty";

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

  const storedUserId = localStorage.getItem('userId');
  const isOwnProfile = userId === 'me' || (storedUserId && storedUserId === userId);

  // -- Function to refresh full profile data ---
  const refreshFullProfile = async () => {
    try {
      const storedId = localStorage.getItem('userId');
      if (!storedId) return;

      // user info
      const userByIdEndpoint = API_ENDPOINTS.users.getById || '/api/v1/users/:id';
      const resUser = await axiosInstance.get(userByIdEndpoint.replace(':id', storedId));
      const userInfo = resUser.data?.userInfo;
      if (!userInfo) return;

      // user posts
      const timelineTemplate = API_ENDPOINTS.posts.getTimeline || '/api/v1/posts/get-timeline-posts/:username';
      const resPosts = await axiosInstance.get(timelineTemplate.replace(':username', userInfo.username));
      const list = Array.isArray(resPosts.data)
        ? resPosts.data
        : Array.isArray(resPosts.data.data)
          ? resPosts.data.data
          : Array.isArray(resPosts.data.posts)
            ? resPosts.data.posts
            : [];

      const gridItems = list.map(p => ({
        id: p._id || p.postId || p.id,
        src: Array.isArray(p.media) && p.media.length ? p.media[0].url : (p.img || p.src || ''),
        desc: p.content || p.desc || '',
        likes: p.likes ? p.likes.length : 0,
        comments: p.comments || []
      }));

      setProfilePosts(gridItems);

      // user profile info
      setProfileUser(prev => ({
        ...prev,
        username: userInfo.username || prev?.username || "User",
        name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || prev?.name || "User",
        avatar: userInfo.profilePicture || prev?.avatar || "",
        bio: userInfo.bio || prev?.bio || "",
        stats: {
          posts: gridItems.length,
          followers: Array.isArray(userInfo.followers) ? userInfo.followers.length : prev?.stats?.followers || 0,
          following: Array.isArray(userInfo.followings) ? userInfo.followings.length : prev?.stats?.following || 0
        }
      }));

    } catch (err) {
      console.error("Failed to refresh full profile:", err);
      setPostsError(err.response?.data?.message || err.message || 'Failed to load posts');
    }
  };

  // --- Effect to load profile data on mount and when userId changes ---
  useEffect(() => {
    let cancelled = false;

    const onStatsUpdate = () => {
      refreshFullProfile();
    };

    refreshFullProfile();

    window.addEventListener("profile-stats-updated", onStatsUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener("profile-stats-updated", onStatsUpdate);
    };
  }, [userId]);

  // --- Handlers ---
  const onEditClick = () => {
    if (isOwnProfile) {
      navigate("/edit-profile");
    } else {
      alert("You do not have permission to edit this profile");
    }
  };

  const onShareClick = async () => {
    try {
      const profileLink = window.location.href;
      await navigator.clipboard.writeText(profileLink);
      alert("Profile link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy profile link:", err);
      alert("Unable to copy the profile link");
    }
  };

  if (!profileUser) return <div>Loading profile...</div>;

  return (
    <div className="ig-profile">
      <ProfileHeader user={profileUser} onEditClick={onEditClick} onShareClick={onShareClick} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "posts" && (
        postsLoading ? <div>Loading posts...</div>
          : postsError ? <div style={{ color: 'red' }}>Error loading posts: {postsError}</div>
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
    </div>
  );
}
