import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authService = {
    login: async (credentials) => {
        try {
            console.log('Making login request to:', API_BASE_URL + API_ENDPOINTS.auth.login)
            const response = await api.post(API_ENDPOINTS.auth.login, credentials);
            console.log('Login response:', response.data)
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Login error details:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    },

    register: async (userData, isFormData = false) => {
        try {
            let config = {};
            if (isFormData) {
                config.headers = { 'Content-Type': 'multipart/form-data' };
            }
            const response = await api.post(API_ENDPOINTS.auth.register, userData, config);
            // Save user and token if returned
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.log('Registered user (frontend):', userData)
            console.error('Register error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};