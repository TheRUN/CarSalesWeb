import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CarDetails from '../views/CarDetails.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import SellerDashboard from '../views/SellerDashboard.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/car/:id',
        name: 'CarDetails',
        component: CarDetails
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/seller/dashboard',
        name: 'SellerDashboard',
        component: SellerDashboard,
        meta: { requiresAuth: true, role: 'seller' }
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, role: 'admin' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else if (to.meta.role === 'admin' && user.role !== 'admin') {
        next('/');
    } else if (to.meta.role === 'seller' && user.role !== 'seller' && user.role !== 'admin') {
        next('/');
    } else {
        next();
    }
});

export default router;
