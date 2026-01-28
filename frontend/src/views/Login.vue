<template>
  <div class="login-page">
    <div class="login-container">
      <h2>Login to Your Account</h2>
      
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="formData.email" 
            type="email" 
            required 
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="formData.password" 
            type="password" 
            required 
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <div class="form-footer">
        <p>Don't have an account? <router-link to="/register">Sign up here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const formData = ref({
      email: '',
      password: ''
    });
    
    const loading = ref(false);
    const errorMessage = ref('');
    
    const handleLogin = async () => {
      loading.value = true;
      errorMessage.value = '';
      
      try {
        await authStore.login(formData.value);
        
        // Redirect based on role
        if (authStore.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/seller/dashboard');
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Login failed. Please try again.';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      formData,
      loading,
      errorMessage,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 450px;
}

.login-container h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.login-container button {
  width: 100%;
  margin-top: 20px;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

.form-footer a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>
