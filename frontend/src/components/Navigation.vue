<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">
        🚗 Car Sales Web
      </router-link>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        
        <template v-if="authStore.isAuthenticated">
          <router-link v-if="authStore.isSeller" to="/seller/dashboard" class="nav-link">
            My Dashboard
          </router-link>
          <router-link v-if="authStore.isAdmin" to="/admin/dashboard" class="nav-link">
            Admin Panel
          </router-link>
          <span class="nav-user">{{ authStore.user.username }}</span>
          <button @click="handleLogout" class="btn btn-secondary">Logout</button>
        </template>
        
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="btn btn-primary">Sign Up</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'Navigation',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    
    const handleLogout = () => {
      authStore.logout();
      router.push('/');
    };
    
    return {
      authStore,
      handleLogout
    };
  }
};
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #3498db;
}

.nav-user {
  color: white;
  font-weight: 600;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
