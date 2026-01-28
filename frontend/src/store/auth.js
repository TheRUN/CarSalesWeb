import { defineStore } from 'pinia';
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token')
    }),
    
    getters: {
        isAdmin: (state) => state.user?.role === 'admin',
        isSeller: (state) => state.user?.role === 'seller' || state.user?.role === 'admin'
    },
    
    actions: {
        async login(credentials) {
            try {
                const response = await authService.login(credentials);
                this.token = response.data.token;
                this.user = response.data.user;
                this.isAuthenticated = true;
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        
        async register(userData) {
            try {
                const response = await authService.register(userData);
                this.token = response.data.token;
                this.user = response.data.user;
                this.isAuthenticated = true;
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        
        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            authService.logout();
        }
    }
});
