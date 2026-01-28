<template>
  <div class="seller-dashboard">
    <h1>Seller Dashboard</h1>
    <p class="welcome">Welcome back, {{ authStore.user?.username }}!</p>
    
    <div class="dashboard-actions">
      <button @click="showAddForm = true" class="btn btn-primary">
        ➕ Add New Car Listing
      </button>
    </div>
    
    <div v-if="showAddForm || editingCar" class="form-modal">
      <div class="modal-content">
        <CarForm 
          :car="editingCar"
          @submit="handleCarSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>
    
    <div class="dashboard-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'cars' }]"
        @click="activeTab = 'cars'"
      >
        My Cars ({{ myCars.length }})
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'inquiries' }]"
        @click="activeTab = 'inquiries'"
      >
        Inquiries ({{ inquiries.length }})
      </button>
    </div>
    
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
    
    <div v-if="activeTab === 'cars'" class="tab-content">
      <div v-if="loading" class="loading">Loading your cars...</div>
      
      <div v-else-if="myCars.length === 0" class="no-data">
        <p>You haven't added any car listings yet.</p>
      </div>
      
      <div v-else class="car-grid">
        <CarCard 
          v-for="car in myCars" 
          :key="car.id" 
          :car="car" 
          :show-actions="true"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
    
    <div v-if="activeTab === 'inquiries'" class="tab-content">
      <div v-if="loading" class="loading">Loading inquiries...</div>
      
      <div v-else-if="inquiries.length === 0" class="no-data">
        <p>No inquiries received yet.</p>
      </div>
      
      <div v-else class="inquiries-list">
        <div v-for="inquiry in inquiries" :key="inquiry.id" class="inquiry-card">
          <div class="inquiry-header">
            <h3>{{ inquiry.year }} {{ inquiry.make }} {{ inquiry.model }}</h3>
            <span class="inquiry-date">{{ formatDate(inquiry.created_at) }}</span>
          </div>
          <div class="inquiry-content">
            <p><strong>From:</strong> {{ inquiry.name }}</p>
            <p><strong>Email:</strong> {{ inquiry.email }}</p>
            <p v-if="inquiry.phone"><strong>Phone:</strong> {{ inquiry.phone }}</p>
            <p><strong>Message:</strong></p>
            <p class="message">{{ inquiry.message }}</p>
          </div>
          <div class="inquiry-actions">
            <button @click="deleteInquiry(inquiry.id)" class="btn btn-danger btn-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import CarCard from '../components/CarCard.vue';
import CarForm from '../components/CarForm.vue';
import carService from '../services/carService';
import inquiryService from '../services/inquiryService';

export default {
  name: 'SellerDashboard',
  components: {
    CarCard,
    CarForm
  },
  setup() {
    const authStore = useAuthStore();
    const myCars = ref([]);
    const inquiries = ref([]);
    const loading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    const activeTab = ref('cars');
    const showAddForm = ref(false);
    const editingCar = ref(null);
    
    const fetchMyCars = async () => {
      loading.value = true;
      try {
        const response = await carService.getMyCars();
        myCars.value = response.data;
      } catch (error) {
        errorMessage.value = 'Failed to load your cars';
      } finally {
        loading.value = false;
      }
    };
    
    const fetchInquiries = async () => {
      loading.value = true;
      try {
        const response = await inquiryService.getMyInquiries();
        inquiries.value = response.data;
      } catch (error) {
        errorMessage.value = 'Failed to load inquiries';
      } finally {
        loading.value = false;
      }
    };
    
    const handleCarSubmit = async (formData) => {
      errorMessage.value = '';
      successMessage.value = '';
      
      try {
        if (editingCar.value) {
          await carService.updateCar(editingCar.value.id, formData);
          successMessage.value = 'Car updated successfully!';
        } else {
          await carService.createCar(formData);
          successMessage.value = 'Car added successfully! It will be visible after admin approval.';
        }
        
        closeForm();
        await fetchMyCars();
        
        setTimeout(() => {
          successMessage.value = '';
        }, 5000);
      } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Failed to save car';
      }
    };
    
    const handleEdit = (car) => {
      editingCar.value = car;
      showAddForm.value = false;
    };
    
    const handleDelete = async (car) => {
      if (!confirm(`Are you sure you want to delete ${car.year} ${car.make} ${car.model}?`)) {
        return;
      }
      
      try {
        await carService.deleteCar(car.id);
        successMessage.value = 'Car deleted successfully!';
        await fetchMyCars();
        
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
      } catch (error) {
        errorMessage.value = 'Failed to delete car';
      }
    };
    
    const deleteInquiry = async (id) => {
      if (!confirm('Are you sure you want to delete this inquiry?')) {
        return;
      }
      
      try {
        await inquiryService.deleteInquiry(id);
        successMessage.value = 'Inquiry deleted!';
        await fetchInquiries();
        
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
      } catch (error) {
        errorMessage.value = 'Failed to delete inquiry';
      }
    };
    
    const closeForm = () => {
      showAddForm.value = false;
      editingCar.value = null;
    };
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    onMounted(() => {
      fetchMyCars();
      fetchInquiries();
    });
    
    return {
      authStore,
      myCars,
      inquiries,
      loading,
      errorMessage,
      successMessage,
      activeTab,
      showAddForm,
      editingCar,
      handleCarSubmit,
      handleEdit,
      handleDelete,
      deleteInquiry,
      closeForm,
      formatDate
    };
  }
};
</script>

<style scoped>
.seller-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.seller-dashboard h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.welcome {
  color: #666;
  margin-bottom: 30px;
}

.dashboard-actions {
  margin-bottom: 30px;
}

.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.dashboard-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #ddd;
}

.tab-btn {
  padding: 15px 30px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #007bff;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tab-content {
  margin-top: 30px;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.inquiries-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.inquiry-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.inquiry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.inquiry-header h3 {
  color: #2c3e50;
  margin: 0;
}

.inquiry-date {
  color: #666;
  font-size: 14px;
}

.inquiry-content p {
  margin-bottom: 10px;
  color: #555;
}

.inquiry-content .message {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-top: 10px;
  line-height: 1.6;
}

.inquiry-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.btn-sm {
  padding: 8px 15px;
  font-size: 14px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

@media (max-width: 768px) {
  .car-grid {
    grid-template-columns: 1fr;
  }
  
  .inquiry-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
