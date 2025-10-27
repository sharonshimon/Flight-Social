import api from './api';
import { API_ENDPOINTS } from '../config/api';
import axios from "axios";

const postService = {
    getAllPosts: async () => {
        const response = await api.get(API_ENDPOINTS.posts.getAll);
        return response.data;
    },

    createPost: async (postData) => {
        const response = await api.post(API_ENDPOINTS.posts.create, postData);
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(API_ENDPOINTS.posts.delete(postId));
        return response.data?.data ?? response.data;
    },

    updatePost: async (postId, formData) => {
        const response = await api.put(API_ENDPOINTS.posts.updatePost(postId), formData);
        return response.data?.data ?? response.data;
    },

    likePost: async (postId) => {
        const response = await api.put(API_ENDPOINTS.posts.like(postId));
        return response.data;
    },

    addComment: async (postId, body) => {
        const response = await api.post(API_ENDPOINTS.posts.comment(postId), body);
        return response.data?.data ?? response.data;
    },

    updateComment: async (postId, body) => {
        const response = await api.put(API_ENDPOINTS.posts.updateComment(postId), body);
        return response.data?.data ?? response.data;
    },

    deleteCommentFromPost: async (postId, body) => {
        const response = await api.delete(API_ENDPOINTS.posts.deleteComment(postId), { data: body });
        return response.data?.data ?? response.data;
    },

    getPostsByTag: async (tag) => {
        const response = await api.get(API_ENDPOINTS.posts.byTag(tag));
        return response.data?.data ?? response.data;
    },

    getPostsByUserId: async (userId) => {
        if (!userId) return [];
        const response = await api.get(API_ENDPOINTS.posts.byUserId(userId));
        return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    }
    // getPostsByUserId: async (userId) => {
    //         if (!userId) return [];
    //         const response = await api.get(`/api/v1/posts/${userId}`);
    //         return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    //     }
};

export default postService;
