<template>
  <div class="register-page">
    <div class="register-container">
      <h2>Create Your Account</h2>
      
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Username</label>
          <input 
            v-model="formData.username" 
            type="text" 
            required 
            minlength="3"
            placeholder="Choose a username"
          />
        </div>
        
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
            minlength="6"
            placeholder="Choose a password (min 6 characters)"
          />
        </div>
        
        <div class="form-group">
          <label>Confirm Password</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            required 
            placeholder="Confirm your password"
          />
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>
      
      <div class="form-footer">
        <p>Already have an account? <router-link to="/login">Login here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const formData = ref({
      username: '',
      email: '',
      password: '',
      role: 'seller'
    });
    
    const confirmPassword = ref('');
    const loading = ref(false);
    const errorMessage = ref('');
    
    const handleRegister = async () => {
      // Validate passwords match
      if (formData.value.password !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match';
        return;
      }
      
      loading.value = true;
      errorMessage.value = '';
      
      try {
        await authStore.register(formData.value);
        router.push('/seller/dashboard');
      } catch (error) {
        if (error.response?.data?.errors) {
          errorMessage.value = error.response.data.errors.map(e => e.msg).join(', ');
        } else {
          errorMessage.value = error.response?.data?.error || 'Registration failed. Please try again.';
        }
      } finally {
        loading.value = false;
      }
    };
    
    return {
      formData,
      confirmPassword,
      loading,
      errorMessage,
      handleRegister
    };
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
}

.register-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 450px;
}

.register-container h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.register-container button {
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
