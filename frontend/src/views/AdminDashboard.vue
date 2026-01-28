<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Cars</h3>
        <p class="stat-value">{{ stats.totalCars }}</p>
      </div>
      <div class="stat-card">
        <h3>Pending Approval</h3>
        <p class="stat-value pending">{{ stats.pendingCars }}</p>
      </div>
      <div class="stat-card">
        <h3>Approved Cars</h3>
        <p class="stat-value approved">{{ stats.approvedCars }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-value">{{ stats.totalUsers }}</p>
      </div>
    </div>
    
    <div class="dashboard-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'cars' }]"
        @click="activeTab = 'cars'"
      >
        Manage Cars
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'users' }]"
        @click="activeTab = 'users'"
      >
        Manage Users
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'inquiries' }]"
        @click="activeTab = 'inquiries'"
      >
        All Inquiries
      </button>
    </div>
    
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
    
    <!-- Cars Management -->
    <div v-if="activeTab === 'cars'" class="tab-content">
      <div class="filters">
        <select v-model="carStatusFilter" @change="fetchAllCars">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <div v-if="loading" class="loading">Loading cars...</div>
      
      <div v-else class="cars-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Car</th>
              <th>Seller</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in allCars" :key="car.id">
              <td>{{ car.id }}</td>
              <td>{{ car.year }} {{ car.make }} {{ car.model }}</td>
              <td>{{ car.seller_name }}</td>
              <td>${{ formatPrice(car.price) }}</td>
              <td>
                <span :class="['status-badge', car.status]">
                  {{ car.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    v-if="car.status !== 'approved'"
                    @click="updateCarStatus(car.id, 'approved')"
                    class="btn btn-success btn-sm"
                  >
                    Approve
                  </button>
                  <button 
                    v-if="car.status !== 'rejected'"
                    @click="updateCarStatus(car.id, 'rejected')"
                    class="btn btn-danger btn-sm"
                  >
                    Reject
                  </button>
                  <router-link :to="`/car/${car.id}`" class="btn btn-primary btn-sm">
                    View
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Users Management -->
    <div v-if="activeTab === 'users'" class="tab-content">
      <div v-if="loading" class="loading">Loading users...</div>
      
      <div v-else class="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <span :class="['status-badge', user.status]">
                  {{ user.status }}
                </span>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    v-if="user.status === 'active' && user.role !== 'admin'"
                    @click="updateUserStatus(user.id, 'disabled')"
                    class="btn btn-danger btn-sm"
                  >
                    Disable
                  </button>
                  <button 
                    v-if="user.status === 'disabled'"
                    @click="updateUserStatus(user.id, 'active')"
                    class="btn btn-success btn-sm"
                  >
                    Enable
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Inquiries -->
    <div v-if="activeTab === 'inquiries'" class="tab-content">
      <div v-if="loading" class="loading">Loading inquiries...</div>
      
      <div v-else-if="inquiries.length === 0" class="no-data">
        <p>No inquiries yet.</p>
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
import carService from '../services/carService';
import adminService from '../services/adminService';
import inquiryService from '../services/inquiryService';

export default {
  name: 'AdminDashboard',
  setup() {
    const activeTab = ref('cars');
    const loading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    
    const stats = ref({
      totalCars: 0,
      pendingCars: 0,
      approvedCars: 0,
      rejectedCars: 0,
      totalUsers: 0,
      totalInquiries: 0
    });
    
    const allCars = ref([]);
    const users = ref([]);
    const inquiries = ref([]);
    const carStatusFilter = ref('');
    
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        stats.value = response.data;
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    const fetchAllCars = async () => {
      loading.value = true;
      try {
        const filters = carStatusFilter.value ? { status: carStatusFilter.value } : {};
        const response = await carService.getAllCars(filters);
        allCars.value = response.data;
      } catch (error) {
        errorMessage.value = 'Failed to load cars';
      } finally {
        loading.value = false;
      }
    };
    
    const fetchUsers = async () => {
      loading.value = true;
      try {
        const response = await adminService.getAllUsers();
        users.value = response.data;
      } catch (error) {
        errorMessage.value = 'Failed to load users';
      } finally {
        loading.value = false;
      }
    };
    
    const fetchInquiries = async () => {
      loading.value = true;
      try {
        const response = await inquiryService.getAllInquiries();
        inquiries.value = response.data;
      } catch (error) {
        errorMessage.value = 'Failed to load inquiries';
      } finally {
        loading.value = false;
      }
    };
    
    const updateCarStatus = async (carId, status) => {
      try {
        await adminService.updateCarStatus(carId, status);
        successMessage.value = `Car ${status} successfully!`;
        await fetchAllCars();
        await fetchStats();
        
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
      } catch (error) {
        errorMessage.value = 'Failed to update car status';
      }
    };
    
    const updateUserStatus = async (userId, status) => {
      try {
        await adminService.updateUserStatus(userId, status);
        successMessage.value = `User ${status} successfully!`;
        await fetchUsers();
        
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
      } catch (error) {
        errorMessage.value = 'Failed to update user status';
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
    
    const formatPrice = (price) => {
      return parseFloat(price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    onMounted(() => {
      fetchStats();
      fetchAllCars();
      fetchUsers();
      fetchInquiries();
    });
    
    return {
      activeTab,
      loading,
      errorMessage,
      successMessage,
      stats,
      allCars,
      users,
      inquiries,
      carStatusFilter,
      updateCarStatus,
      updateUserStatus,
      deleteInquiry,
      fetchAllCars,
      formatPrice,
      formatDate
    };
  }
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.admin-dashboard h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-value.pending {
  color: #ffc107;
}

.stat-value.approved {
  color: #28a745;
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

.filters {
  margin-bottom: 20px;
}

.filters select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.cars-table,
.users-table {
  background: white;
  border-radius: 10px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f8f9fa;
}

th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.pending {
  background-color: #ffc107;
  color: #000;
}

.status-badge.approved,
.status-badge.active {
  background-color: #28a745;
  color: white;
}

.status-badge.rejected {
  background-color: #dc3545;
  color: white;
}

.status-badge.disabled {
  background-color: #6c757d;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
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

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .cars-table,
  .users-table {
    font-size: 12px;
  }
  
  th, td {
    padding: 10px 5px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
