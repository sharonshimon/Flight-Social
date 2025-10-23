import api from './api';
import { API_ENDPOINTS } from '../config/api';

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
        // server route: POST base '/api/v1/posts' + '/delete-post/:id' -> '/api/v1/posts/delete-post/:id'
        const base = API_ENDPOINTS.posts.create.replace(/\/$/, '');
        const response = await api.delete(`${base}/delete-post/${postId}`);
        return response.data?.data ?? response.data;
    },

    updatePost: async (postId, formData) => {
        const base = API_ENDPOINTS.posts.create.replace(/\/$/, '');
        const response = await api.put(`${base}/update-post/${postId}`, formData);
        return response.data?.data ?? response.data;
    },

    likePost: async (postId) => {
        const response = await api.put(`/api/v1/posts/like-post/${postId}`);
        return response.data;
    },


    // Create a comment on a post. body should include: { content, isAnonymous, userId }
    addComment: async (postId, body) => {
        const url = (API_ENDPOINTS.posts.comment || '/api/v1/posts/add-comment/:id').replace(':id', postId);
        const response = await api.post(url, body);
        return response.data?.data ?? response.data;
    },

    // Update a comment: body should include { commentId, content, userId }
    updateComment: async (postId, body) => {
        const url = (API_ENDPOINTS.posts.updateComment || '/api/v1/posts/update-comment/:id').replace(':id', postId);
        const response = await api.put(url, body);
        return response.data?.data ?? response.data;
    },

    // Delete a comment: body should include { commentId, userId }
    deleteComment: async (postId, body) => {
        const url = (API_ENDPOINTS.posts.deleteComment || '/api/v1/posts/delete-comment/:id').replace(':id', postId);
        const response = await api.delete(url, { data: body });
        return response.data?.data ?? response.data;
    }
};

export default postService;