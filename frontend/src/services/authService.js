import apiClient from './api';

export default {
    register(userData) {
        return apiClient.post('/auth/register', userData);
    },
    
    login(credentials) {
        return apiClient.post('/auth/login', credentials);
    },
    
    getProfile() {
        return apiClient.get('/auth/profile');
    },
    
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
