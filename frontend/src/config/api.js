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
        delete: '/api/v1/posts/:id',
        like: '/api/v1/posts/like/:id',
        comment: '/api/v1/posts/add-comment/:id',
        updateComment: '/api/v1/posts/update-comment/:id',
        deleteComment: '/api/v1/posts/delete-comment/:id',
        getTimeline: '/api/v1/posts/get-timeline-posts/:username'
    },
    users: {
        getProfile: '/api/v1/users',
        getById: '/api/v1/users/:id',
        updateProfile: '/api/v1/users/:id',
        getFriends: '/api/v1/users/friends/:userId',
        follow: (id) => `/api/v1/users/follow/${id}`,
        unfollow: (id) => `/api/v1/users/unfollow/${id}`,
        updateProfilePicture: '/api/v1/users/:id/profile-picture',
        getAllUsers: '/api/v1/users/all'
    },
    groups: {
        getAll: '/api/v1/groups',
        create: '/api/v1/groups',
        join: '/api/v1/groups/join'
    }
    ,
    chat: {
        list: '/api/v1/chat/conversations',
        messages: '/api/v1/chat/messages/:userId/:peerId',
        start: '/api/v1/chat/start'
    }
};