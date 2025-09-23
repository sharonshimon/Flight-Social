import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const postService = {
    getAllPosts: async () => {
        const response = await api.get(API_ENDPOINTS.posts.getAll);
        return response.data;
    },

    createPost: async (postData) => {
        const response = await api.post(API_ENDPOINTS.posts.create, postData);
        return response.data;
    },

    likePost: async (postId) => {
        const response = await api.post(`${API_ENDPOINTS.posts.like}/${postId}`);
        return response.data;
    },

    commentOnPost: async (postId, comment) => {
        const response = await api.post(`${API_ENDPOINTS.posts.comment}/${postId}`, { comment });
        return response.data;
    }
};