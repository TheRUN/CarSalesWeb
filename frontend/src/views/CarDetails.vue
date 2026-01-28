<template>
  <div class="car-details">
    <div v-if="loading" class="loading">Loading car details...</div>
    
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    
    <div v-else-if="car" class="details-container">
      <div class="details-main">
        <div class="image-gallery">
          <img :src="getCurrentImage()" :alt="car.make + ' ' + car.model" class="main-image" />
          <div v-if="images.length > 1" class="thumbnail-list">
            <img 
              v-for="(image, index) in images" 
              :key="index" 
              :src="getImageUrl(image)"
              :class="['thumbnail', { active: currentImageIndex === index }]"
              @click="currentImageIndex = index"
              :alt="'Image ' + (index + 1)"
            />
          </div>
        </div>
        
        <div class="car-info-section">
          <div class="status-badge" v-if="car.status !== 'approved'">
            Status: {{ car.status }}
          </div>
          
          <h1>{{ car.year }} {{ car.make }} {{ car.model }}</h1>
          <p class="price">${{ formatPrice(car.price) }}</p>
          
          <div class="specifications">
            <h3>Specifications</h3>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="spec-label">Year</span>
                <span class="spec-value">{{ car.year }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Mileage</span>
                <span class="spec-value">{{ car.mileage.toLocaleString() }} km</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Transmission</span>
                <span class="spec-value">{{ capitalize(car.transmission) }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Fuel Type</span>
                <span class="spec-value">{{ capitalize(car.fuel_type) }}</span>
              </div>
              <div v-if="car.color" class="spec-item">
                <span class="spec-label">Color</span>
                <span class="spec-value">{{ car.color }}</span>
              </div>
              <div v-if="car.body_type" class="spec-item">
                <span class="spec-label">Body Type</span>
                <span class="spec-value">{{ car.body_type }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="car.description" class="description">
            <h3>Description</h3>
            <p>{{ car.description }}</p>
          </div>
          
          <div class="seller-info">
            <h3>Seller Information</h3>
            <p><strong>Name:</strong> {{ car.seller_name }}</p>
          </div>
        </div>
      </div>
      
      <div class="inquiry-section">
        <InquiryForm :car-id="car.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import InquiryForm from '../components/InquiryForm.vue';
import carService from '../services/carService';

export default {
  name: 'CarDetails',
  components: {
    InquiryForm
  },
  setup() {
    const route = useRoute();
    const car = ref(null);
    const loading = ref(false);
    const errorMessage = ref('');
    const currentImageIndex = ref(0);
    
    const images = computed(() => {
      if (!car.value?.images) return [];
      try {
        return JSON.parse(car.value.images);
      } catch (e) {
        return [];
      }
    });
    
    const fetchCarDetails = async () => {
      loading.value = true;
      errorMessage.value = '';
      
      try {
        const response = await carService.getCarById(route.params.id);
        car.value = response.data;
      } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Failed to load car details';
      } finally {
        loading.value = false;
      }
    };
    
    const getImageUrl = (filename) => {
      return `${process.env.VUE_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${filename}`;
    };
    
    const getCurrentImage = () => {
      if (images.value.length > 0) {
        return getImageUrl(images.value[currentImageIndex.value]);
      }
      return 'https://via.placeholder.com/800x600?text=No+Image';
    };
    
    const formatPrice = (price) => {
      return parseFloat(price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
    
    const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    
    onMounted(() => {
      fetchCarDetails();
    });
    
    return {
      car,
      loading,
      errorMessage,
      currentImageIndex,
      images,
      getCurrentImage,
      getImageUrl,
      formatPrice,
      capitalize
    };
  }
};
</script>

<style scoped>
.car-details {
  max-width: 1200px;
  margin: 0 auto;
}

.details-container {
  display: grid;
  gap: 30px;
}

.details-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
  border: 2px solid transparent;
}

.thumbnail:hover,
.thumbnail.active {
  opacity: 1;
  border-color: #007bff;
}

.car-info-section h1 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.price {
  font-size: 36px;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 30px;
}

.status-badge {
  display: inline-block;
  padding: 5px 15px;
  background-color: #ffc107;
  color: #000;
  border-radius: 5px;
  font-weight: bold;
  margin-bottom: 15px;
}

.specifications,
.description,
.seller-info {
  margin-bottom: 30px;
}

.specifications h3,
.description h3,
.seller-info h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.spec-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.spec-value {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.description p {
  line-height: 1.6;
  color: #555;
}

.inquiry-section {
  max-width: 600px;
}

@media (max-width: 968px) {
  .details-main {
    grid-template-columns: 1fr;
  }
  
  .spec-grid {
    grid-template-columns: 1fr;
  }
}
</style>
