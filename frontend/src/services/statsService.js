import api from './api';
import axios from "axios";
import { API_ENDPOINTS } from '../config/api';
import groupService from "./groupService";
import postService from "./postService";

const statsService = {
    getPostsByCountry: async () => {
        const { raw: groups } = await groupService.getAllGroups();
        return groups.map(g => ({
            country: g.name,
            postCount: g.posts?.length || 0
        }));
    },

    getAvgLikesByGroup: async () => {
        const { raw: groups } = await groupService.getAllGroups();

        return groups.map(g => {
            const posts = g.posts || [];
            const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
            const avgLikes = posts.length > 0 ? totalLikes / posts.length : 0;

            return {
                groupName: g.name,
                avgLikes: Number(avgLikes.toFixed(2))
            };
        });
    },

    getPostsByMonth: async () => {
        const response = await postService.getAllPosts();
        const posts = response.data || [];
        const counts = {};

        posts.forEach(post => {
            if (!post.createdAt) return;
            const date = new Date(post.createdAt);
            const month = date.toLocaleString("default", { month: "short" });
            counts[month] = (counts[month] || 0) + 1;
        });

        return Object.entries(counts).map(([month, count]) => ({ month, count }));
    },
};


export default statsService;