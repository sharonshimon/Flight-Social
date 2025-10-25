import { get } from "mongoose";

// Use empty base so requests go through Vite dev-server proxy (recommended for dev)
export const API_BASE_URL = ''; // when running in dev, Vite proxy will forward '/api' to backend

// API endpoints configuration
export const API_ENDPOINTS = {
    auth: {
        login: '/api/v1/auth/login',
        register: '/api/v1/auth/register'
    },
    posts: {
        getAll: '/api/v1/posts',
        create: '/api/v1/posts',
        delete: (id) => `/api/v1/posts/delete-post/${id}`,
        updatePost: (id) => `/api/v1/posts/update-post/${id}`,
        like: (id) => `/api/v1/posts/like-post/${id}`,
        comment: (id) => `/api/v1/posts/add-comment/${id}`,
        updateComment: (id) => `/api/v1/posts/update-comment/${id}`,
        deleteComment: (id) => `/api/v1/posts/delete-comment/${id}`,
        byTag: (tag) => `/posts/byTag/${tag}`,
        getTimeline: (username) => `/api/v1/posts/get-timeline-posts/${username}`
    },
    users: {
        getProfile: '/api/v1/users',
        getById: (id) => `/api/v1/users/${id}`,
        updateProfile: (id) => `/api/v1/users/${id}`,
        getFriends: (userId) => `/api/v1/users/friends/${userId}`,
        getFollowers: (userId) => `/api/v1/users/followers/${userId}`,
        follow: (id) => `/api/v1/users/follow/${id}`,
        unfollow: (id) => `/api/v1/users/unfollow/${id}`,
        updateProfilePicture: (id) => `/api/v1/users/${id}/profile-picture`,
        getAllUsers: '/api/v1/users/all'
    },
    groups: {
        getAllGroups: '/api/v1/groups',
        createGroup: '/api/v1/groups',
        getGroupById: (id) => `/api/v1/groups/${id}`,
        joinGroup: (id) => `/api/v1/groups/${id}/join`,
        leaveGroup: (id) => `/api/v1/groups/${id}/leave`,
        updateGroup: (id) => `/api/v1/groups/${id}`,
        deleteGroup: (id) => `/api/v1/groups/${id}`,
    },
    chat: {
        list: '/api/v1/chat/conversations',
        messages: (userId, peerId) => `/api/v1/chat/messages/${userId}/${peerId}`,
        start: '/api/v1/chat/start'
    }
};
