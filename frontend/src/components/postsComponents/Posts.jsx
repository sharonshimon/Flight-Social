import React, { useEffect, useState } from "react";
import Post from "./Post";
import "./posts.css";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";

const Posts = ({ posts: initialPosts = null, filters = {} }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // central fetch function that accepts optional params (startDate, endDate, tag, etc.)
  const fetchPosts = async (opts = {}) => {
    setLoading(true);
    setError(null);
    try {
      // If caller requested posts for a specific group, force the general posts
      // endpoint and pass the group filter as query params. Timeline/user
      // endpoints do not respect group filtering, so we must call the main
      // listing endpoint to get group-scoped posts only.
      if (opts && opts.group) {
        const res = await axiosInstance.get(API_ENDPOINTS.posts.getAll, { params: opts });
        const data = res.data;
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data.posts)) list = data.posts;
        else if (Array.isArray(data.data)) list = data.data;
        else if (Array.isArray(data.result)) list = data.result;
        setPosts(list);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      console.debug('Posts.fetchPosts - token present:', !!token);
      if (token) console.debug('Posts.fetchPosts - token (masked):', `${token.slice(0, 10)}...`);

      const storedUserId = localStorage.getItem('userId');
      let res;

  if (storedUserId) {
        try {
          console.debug('Posts.fetchPosts - fetching user by id:', storedUserId);
          const userRes = await axiosInstance.get(API_ENDPOINTS.users.getById(storedUserId));
          const username = userRes?.data?.userInfo?.username;

          if (username) {
            console.debug('Posts.fetchPosts - got username from id:', username);
            const timelineUrl = API_ENDPOINTS.posts.getTimeline(username);
            res = await axiosInstance.get(uidQuery(timelineUrl, storedUserId), { params: opts });
          } else {
            console.warn('Posts.fetchPosts - username not found for id, falling back to getAll');
            res = await axiosInstance.get(API_ENDPOINTS.posts.getAll, { params: opts });
          }
        } catch (userErr) {
          console.error('Posts.fetchPosts - error fetching user by id', userErr.response?.data || userErr.message);
          res = await axiosInstance.get(API_ENDPOINTS.posts.getAll, { params: opts });
        }
      } else {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          if (user?.username) {
            const uidFromUser = user?._id || user?.id || '';
            const timelineUrl = API_ENDPOINTS.posts.getTimeline(user.username);
            res = await axiosInstance.get(uidFromUser ? uidQuery(timelineUrl, uidFromUser) : timelineUrl, { params: opts });
          } else {
            res = await axiosInstance.get(API_ENDPOINTS.posts.getAll, { params: opts });
          }
        } else {
          res = await axiosInstance.get(API_ENDPOINTS.posts.getAll, { params: opts });
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

      setPosts(list);
    } catch (err) {
      console.error('Posts.fetchPosts error', extractErrInfo(err));
      const serverMsg = err.response?.data?.message || (err.response?.data ? JSON.stringify(err.response.data) : null);
      setError(serverMsg || err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If parent passed posts (e.g., TagFeed), use them; otherwise fetch
    if (initialPosts && Array.isArray(initialPosts)) {
      setPosts(initialPosts);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const onPostCreated = (e) => {
      console.debug('Posts: received post-created event, detail:', e.detail);
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

  fetchPosts(filters);

    window.addEventListener('post-created', onPostCreated);
    window.addEventListener('post-deleted', onPostDeleted);
    window.addEventListener('post-updated', onPostUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener('post-created', onPostCreated);
      window.removeEventListener('post-deleted', onPostDeleted);
      window.removeEventListener('post-updated', onPostUpdated);
    };
  }, [initialPosts]);

  const applyDateFilter = async () => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    await fetchPosts(params);
  };

  const clearDateFilter = async () => {
    setStartDate('');
    setEndDate('');
    await fetchPosts();
  };

  if (loading) return <div className="posts">Loading posts...</div>;
  if (error) return <div className="posts">Error loading posts: {error}</div>;
  if (!posts.length) return <div className="posts">No posts to show</div>;

  return (
    <div>
      <div className="posts-filters" style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>
          From: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label style={{ marginRight: 8 }}>
          To: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <button onClick={applyDateFilter} style={{ marginRight: 6 }}>Apply</button>
        <button onClick={clearDateFilter}>Clear</button>
      </div>

      <div className="posts">
        {posts.map((post) => (
          <Post post={post} key={post._id || post.id} />
        ))}
      </div>
    </div>
  );
};

// helper utilities
function uidQuery(url, uid) {
  return `${url}?userId=${encodeURIComponent(uid)}`;
}

function extractErrInfo(err) {
  return {
    status: err.response?.status,
    data: err.response?.data,
    message: err.message,
  };
}

export default Posts;
