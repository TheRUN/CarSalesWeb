import apiClient from './api';

export default {
    getAllUsers() {
        return apiClient.get('/admin/users');
    },
    
    updateUserStatus(id, status) {
        return apiClient.put(`/admin/users/${id}/status`, { status });
    },
    
    deleteUser(id) {
        return apiClient.delete(`/admin/users/${id}`);
    },
    
    updateCarStatus(id, status) {
        return apiClient.put(`/admin/cars/${id}/status`, { status });
    },
    
    getDashboardStats() {
        return apiClient.get('/admin/stats');
    }
};
