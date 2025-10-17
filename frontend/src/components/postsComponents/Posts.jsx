import React, { useEffect, useState } from "react";
import Post from "./Post";
import "./posts.css";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const onPostCreated = (e) => {
      console.debug('Posts: received post-created event, detail:', e.detail);
      // If the API returned the created post object in event.detail, prepend it optimistically
      if (e.detail) {
        setPosts(prev => [e.detail, ...prev]);
        return;
      }
      console.debug('Posts: no detail in event, refetching');
      fetchPosts();
    };

    const onPostDeleted = (e) => {
      console.debug('Posts: received post-deleted event, detail:', e.detail);
      const id = e.detail?.id;
      if (!id) return;
      setPosts(prev => prev.filter(p => (p._id || p.id) !== id));
    };

    const onPostUpdated = (e) => {
      console.debug('Posts: received post-updated event, detail:', e.detail);
      const id = e.detail?.id;
      const updated = e.detail?.post;
      if (!id || !updated) return;
      setPosts(prev => prev.map(p => ((p._id || p.id) === id ? updated : p)));
    };

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // debug: check token presence
        const token = localStorage.getItem('token');
        console.debug('Posts.fetchPosts - token present:', !!token);
        if (token) console.debug('Posts.fetchPosts - token (masked):', `${token.slice(0, 10)}...`);

        // Prefer using stored userId to request the username from server, then fetch timeline by username
        const storedUserId = localStorage.getItem('userId');
        let res;
        if (storedUserId) {
          try {
            console.debug('Posts.fetchPosts - fetching user by id:', storedUserId);
            const userByIdEndpoint = API_ENDPOINTS.users.getById || '/api/v1/users/:id';
            const userRes = await axiosInstance.get(userByIdEndpoint.replace(':id', storedUserId));
            const username = userRes?.data?.userInfo?.username;
            if (username) {
              console.debug('Posts.fetchPosts - got username from id:', username);
              const timelineEndpointTemplate = API_ENDPOINTS.posts.getTimeline || '/api/v1/posts/get-timeline-posts/:username';
              // include userId as query param so server receives both
              const timelineUrl = `${timelineEndpointTemplate.replace(':username', username)}?userId=${encodeURIComponent(storedUserId)}`;
              console.debug('Posts.fetchPosts - calling timeline URL:', timelineUrl);
              res = await axiosInstance.get(timelineUrl);
            } else {
              console.warn('Posts.fetchPosts - username not found for id, falling back to getAll');
              res = await axiosInstance.get(API_ENDPOINTS.posts.getAll);
            }
          } catch (userErr) {
            console.error('Posts.fetchPosts - error fetching user by id', userErr.response?.data || userErr.message);
            // fallback to getAll if user fetch fails
            res = await axiosInstance.get(API_ENDPOINTS.posts.getAll);
          }
        } else {
          // fallback: try to read username from stored user object
          const userJson = localStorage.getItem('user');
          if (userJson) {
            const user = JSON.parse(userJson);
            if (user?.username) {
              const uidFromUser = user?._id || user?.id || '';
              const timelineEndpointTemplate = API_ENDPOINTS.posts.getTimeline || '/api/v1/posts/get-timeline-posts/:username';
              const timelineUrl = uidFromUser
                ? `${timelineEndpointTemplate.replace(':username', user.username)}?userId=${encodeURIComponent(uidFromUser)}`
                : timelineEndpointTemplate.replace(':username', user.username);
              console.debug('Posts.fetchPosts - calling timeline URL (from stored user):', timelineUrl);
              res = await axiosInstance.get(timelineUrl);
            } else {
              res = await axiosInstance.get(API_ENDPOINTS.posts.getAll);
            }
          } else {
            res = await axiosInstance.get(API_ENDPOINTS.posts.getAll);
          }
        }
        const data = res.data;

        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.posts)) {
          list = data.posts;
        } else if (Array.isArray(data.data)) {
          list = data.data;
        } else if (Array.isArray(data.result)) {
          list = data.result;
        }

        if (!cancelled) setPosts(list);
      } catch (err) {
        if (!cancelled) {
          // log full error for debugging
          console.error('Posts.fetchPosts error', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
          });

          const serverMsg = err.response?.data?.message || (err.response?.data ? JSON.stringify(err.response.data) : null);
          setError(serverMsg || err.message || "Failed to load posts");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

  fetchPosts();

  // listen for post-created events (dispatched by NewPost)
  window.addEventListener('post-created', onPostCreated);
  window.addEventListener('post-deleted', onPostDeleted);
  window.addEventListener('post-updated', onPostUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener('post-created', onPostCreated);
      window.removeEventListener('post-deleted', onPostDeleted);
      window.removeEventListener('post-updated', onPostUpdated);
    };
  }, []);

  if (loading) return <div className="posts">Loading posts...</div>;
  if (error) return <div className="posts">Error loading posts: {error}</div>;
  if (!posts.length) return <div className="posts">No posts to show</div>;

  return (
    <div className="posts">
      {posts.map((post) => (
        <Post post={post} key={post._id || post.id} />
      ))}
    </div>
  );
};

export default Posts;