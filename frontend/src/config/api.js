export const API_BASE_URL = 'http://localhost:3000';

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
        comment: '/api/v1/posts/comment/:id'
    },
    users: {
        getProfile: '/api/v1/users',
        getById: '/api/v1/users/:id',
        updateProfile: '/api/v1/users/:id',
        getFriends: '/api/v1/users/friends/:userId',
        follow: '/api/v1/users/follow/:id',
        unfollow: '/api/v1/users/unfollow/:id',
        updateProfilePicture: '/api/v1/users/:id/profile-picture'
    },
    groups: {
        getAll: '/api/v1/groups',
        create: '/api/v1/groups',
        join: '/api/v1/groups/join'
    }
};