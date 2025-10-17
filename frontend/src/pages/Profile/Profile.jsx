import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";
import "./Profile.css";
import ProfileModal from "./ProfileModel";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileGrid from "./ProfileGrid";
import ProfileEmpty from "./ProfileEmpty";

const samplePosts = [
  {
    id: "p1",
    src: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1000&auto=format&fit=crop",
    desc: "Sunrise over Phi Phi 🏝️",
    likes: 128,
    comments: [
      { id: "c1", author: "Mia", text: "Insane colors!", at: "2h" },
      { id: "c2", author: "Alex", text: "Wish I was there 😍", at: "1h" },
    ],
  },
  {
    id: "p2",
    src: "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=1000&auto=format&fit=crop",
    desc: "Bangkok street food tour 🍜",
    likes: 89,
    comments: [{ id: "c1", author: "Dana", text: "Pad thai pls!", at: "3h" }],
  },
  {
    id: "p3",
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop",
    desc: "Golden hour at the temple ✨",
    likes: 207,
    comments: [],
  },
  {
    id: "p4",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    desc: "Island hop! 🛥️",
    likes: 64,
    comments: [{ id: "c1", author: "Rina", text: "Save me a seat!", at: "5h" }],
  },
  {
    id: "p5",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop",
    desc: "Cloud surfing en route ⛅",
    likes: 151,
    comments: [{ id: "c1", author: "Maya", text: "Pilot vibes!", at: "1d" }],
  },
];

export default function Profile() {
  const params = useParams();
  const userId = params.id ?? "me";
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);

  // Fallback user (memoized so it doesn’t recreate on every render)
  const fallbackUser = useMemo(
    () => ({
      username: "aviator",
      name: "Aviator",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Thailand Addict!!!!!",
      stats: { posts: 42, followers: 318, following: 180 },
      posts: samplePosts,
    }),
    []
  );

  // Try getting logged-in user
  let currentUser = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      currentUser = {
        username: userObj.username || userObj.firstName || "User",
        name: userObj.firstName +" "+ userObj.lastName || "User",
        avatar:
          userObj.profilePicture ||
          "https://randomuser.me/api/portraits/men/32.jpg",
        bio: userObj.bio,
        stats: { posts: 42, followers: 318, following: 180 },
        posts: samplePosts,
      };
    }
  } catch (e) {
    console.error("Error parsing localStorage user:", e);
  }

  if (!currentUser) currentUser = fallbackUser;

  // Keep the displayed profile user in state so we can update stats
  const [profileUser, setProfileUser] = useState(() => ({
    username: currentUser.username,
    name: currentUser.name,
    avatar: currentUser.avatar,
    bio: currentUser.bio,
    stats: currentUser.stats || { posts: (currentUser.posts || []).length, followers: 0, following: 0 }
  }));

  // Profile posts state (grid expects items with id, src, desc, likes, comments)
  const [profilePosts, setProfilePosts] = useState(currentUser.posts || []);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const storedUserId = localStorage.getItem('userId');
  const isOwnProfile = userId === 'me' || (storedUserId && storedUserId === userId);

  useEffect(() => {
    let cancelled = false;
    const loadProfilePosts = async () => {
      setPostsLoading(true);
      setPostsError(null);
      try {
        // If params.id is 'me' or matches logged-in user id, use local user
        const paramsId = userId;
        let username = null;
        if (paramsId === "me") {
            // try to fetch full user info for 'me' to get followers/following counts
            username = currentUser.username || (currentUser.user && currentUser.user.username) || null;
            try {
              const storedId = localStorage.getItem('userId');
              if (storedId) {
                const userByIdEndpoint = API_ENDPOINTS.users.getById || '/api/v1/users/:id';
                const meRes = await axiosInstance.get(userByIdEndpoint.replace(':id', storedId));
                const userInfo = meRes?.data?.userInfo;
                if (userInfo) {
                  // update profileUser with full info
                  setProfileUser(prev => ({
                    ...prev,
                    username: userInfo.username || prev.username,
                    name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || prev.name,
                    avatar: userInfo.profilePicture || prev.avatar,
                    bio: userInfo.bio || prev.bio,
                    stats: {
                      posts: prev.stats.posts,
                      followers: Array.isArray(userInfo.followers) ? userInfo.followers.length : (userInfo.followers || prev.stats.followers || 0),
                      following: Array.isArray(userInfo.followings) ? userInfo.followings.length : (userInfo.followings || prev.stats.following || 0)
                    }
                  }));
                }
              }
            } catch (meErr) {
              console.debug('Profile: unable to fetch full current user info', meErr.response?.data || meErr.message);
            }
        } else {
          // fetch user by id to get username
          try {
            const userByIdEndpoint = API_ENDPOINTS.users.getById || '/api/v1/users/:id';
            const userRes = await axiosInstance.get(userByIdEndpoint.replace(':id', paramsId));
            const userInfo = userRes?.data?.userInfo;
            username = userInfo?.username;
            if (userInfo) {
              setProfileUser(prev => ({
                ...prev,
                username: userInfo.username || prev.username,
                name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || prev.name,
                avatar: userInfo.profilePicture || prev.avatar,
                bio: userInfo.bio || prev.bio,
                stats: {
                  posts: prev.stats.posts,
                  followers: Array.isArray(userInfo.followers) ? userInfo.followers.length : (userInfo.followers || prev.stats.followers || 0),
                  following: Array.isArray(userInfo.followings) ? userInfo.followings.length : (userInfo.followings || prev.stats.following || 0)
                }
              }));
            }
          } catch (e) {
            console.error('Profile: failed to fetch user by id', e.response?.data || e.message);
          }
        }

        if (!username) {
          // fallback: try currentUser.username or return empty
          username = currentUser.username || null;
        }

        if (!username) {
          setProfilePosts([]);
          return;
        }

        // call timeline posts for this username (timeline endpoint returns user's posts)
        const timelineTemplate = API_ENDPOINTS.posts.getTimeline || '/api/v1/posts/get-timeline-posts/:username';
        const res = await axiosInstance.get(timelineTemplate.replace(':username', username));
        const data = res.data;

        const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (Array.isArray(data.posts) ? data.posts : []));

        // transform into grid format
        const gridItems = list.map(p => ({
          id: p._id || p.postId || p.id,
          src: Array.isArray(p.media) && p.media.length ? p.media[0].url : (p.img || p.src || ''),
          desc: p.content || p.desc || '',
          likes: p.likes ? p.likes.length : 0,
          comments: p.comments || []
        }));

        if (!cancelled) {
          setProfilePosts(gridItems);
          // update posts count in header/stats
          setProfileUser(prev => ({
            ...prev,
            stats: {
              ...(prev.stats || {}),
              posts: gridItems.length
            }
          }));
        }
      } catch (err) {
        console.error('Profile: error loading posts', err.response?.data || err.message);
        if (!cancelled) setPostsError(err.response?.data?.message || err.message || 'Failed to load posts');
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    };

    loadProfilePosts();

    const onPostUpdated = (e) => {
      const id = e.detail?.id;
      const updated = e.detail?.post;
      if (!id || !updated) return;
      // Map the returned post shape to grid item shape
      const gridItem = {
        id: updated._id || updated.id || updated.postId,
        src: Array.isArray(updated.media) && updated.media.length ? updated.media[0].url : (updated.img || ''),
        desc: updated.content || updated.desc || '',
        likes: updated.likes ? updated.likes.length : 0,
        comments: updated.comments || []
      };
      setProfilePosts(prev => prev.map(p => (p.id === gridItem.id ? gridItem : p)));
      // if selectedPost is open, update it too
      setSelectedPost(prev => (prev && prev.id === gridItem.id ? gridItem : prev));
    };

    const onPostDeleted = (e) => {
      const id = e.detail?.id;
      if (!id) return;
      setProfilePosts(prev => prev.filter(p => p.id !== id));
      setSelectedPost(prev => (prev && prev.id === id ? null : prev));
    };

    window.addEventListener('post-updated', onPostUpdated);
    window.addEventListener('post-deleted', onPostDeleted);

    return () => { cancelled = true; window.removeEventListener('post-updated', onPostUpdated); window.removeEventListener('post-deleted', onPostDeleted); };
  }, [userId]);

  return (
    <div className="ig-profile">
      <ProfileHeader user={profileUser} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "posts" && (
        postsLoading ? <div>Loading posts...</div>
        : postsError ? <div style={{color:'red'}}>Error loading posts: {postsError}</div>
        : <ProfileGrid posts={profilePosts} onPostClick={setSelectedPost} />
      )}
      {activeTab === "reels" && <ProfileEmpty text="No reels yet" />}
      {activeTab === "tagged" && (
        <ProfileEmpty text="Photos of you will appear here" />
      )}

      {selectedPost && (
        <ProfileModal
          photo={selectedPost.src}
          onClose={() => setSelectedPost(null)}
          post={{
            id: selectedPost.id,
            profilePic: profileUser.avatar || currentUser.avatar,
            name: profileUser.name || currentUser.name,
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
