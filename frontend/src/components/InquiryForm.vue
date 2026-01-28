<template>
  <div class="inquiry-form">
    <h3>Interested in this car?</h3>
    <p>Send an inquiry to the seller</p>
    
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    
    <form @submit.prevent="submitInquiry">
      <div class="form-group">
        <label>Your Name *</label>
        <input v-model="formData.name" type="text" required placeholder="Enter your name" />
      </div>
      
      <div class="form-group">
        <label>Your Email *</label>
        <input v-model="formData.email" type="email" required placeholder="Enter your email" />
      </div>
      
      <div class="form-group">
        <label>Your Phone</label>
        <input v-model="formData.phone" type="tel" placeholder="Enter your phone number" />
      </div>
      
      <div class="form-group">
        <label>Message *</label>
        <textarea 
          v-model="formData.message" 
          required 
          placeholder="I'm interested in this car..."
        ></textarea>
      </div>
      
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send Inquiry' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import inquiryService from '../services/inquiryService';

export default {
  name: 'InquiryForm',
  props: {
    carId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const formData = ref({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    
    const loading = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    
    const submitInquiry = async () => {
      loading.value = true;
      successMessage.value = '';
      errorMessage.value = '';
      
      try {
        await inquiryService.createInquiry({
          car_id: props.carId,
          ...formData.value
        });
        
        successMessage.value = 'Your inquiry has been sent successfully!';
        
        // Reset form
        formData.value = {
          name: '',
          email: '',
          phone: '',
          message: ''
        };
        
        setTimeout(() => {
          successMessage.value = '';
        }, 5000);
      } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Failed to send inquiry. Please try again.';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      formData,
      loading,
      successMessage,
      errorMessage,
      submitInquiry
    };
  }
};
</script>

<style scoped>
.inquiry-form {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.inquiry-form h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.inquiry-form p {
  color: #666;
  margin-bottom: 20px;
}

.inquiry-form button {
  width: 100%;
}
</style>
