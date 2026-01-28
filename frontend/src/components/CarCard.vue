<template>
  <div class="car-card" @click="goToDetails">
    <div class="car-image">
      <img v-if="car.images" :src="getImageUrl(car.images)" :alt="car.make + ' ' + car.model" />
      <img v-else src="https://via.placeholder.com/300x200?text=No+Image" alt="No image" />
      <span v-if="car.status === 'pending'" class="status-badge pending">Pending</span>
      <span v-if="car.status === 'rejected'" class="status-badge rejected">Rejected</span>
    </div>
    
    <div class="car-info">
      <h3 class="car-title">{{ car.year }} {{ car.make }} {{ car.model }}</h3>
      <p class="car-price">${{ formatPrice(car.price) }}</p>
      
      <div class="car-details">
        <span class="detail-item">📍 {{ car.mileage.toLocaleString() }} km</span>
        <span class="detail-item">⚙️ {{ car.transmission }}</span>
        <span class="detail-item">⛽ {{ car.fuel_type }}</span>
      </div>
      
      <div class="car-meta">
        <span v-if="car.color" class="meta-item">{{ car.color }}</span>
        <span v-if="car.body_type" class="meta-item">{{ car.body_type }}</span>
      </div>
      
      <div v-if="showActions" class="car-actions">
        <button @click.stop="$emit('edit', car)" class="btn btn-primary">Edit</button>
        <button @click.stop="$emit('delete', car)" class="btn btn-danger">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'CarCard',
  props: {
    car: {
      type: Object,
      required: true
    },
    showActions: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete'],
  setup(props) {
    const router = useRouter();
    
    const goToDetails = () => {
      router.push(`/car/${props.car.id}`);
    };
    
    const getImageUrl = (images) => {
      try {
        const imageArray = JSON.parse(images);
        if (imageArray && imageArray.length > 0) {
          return `${process.env.VUE_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${imageArray[0]}`;
        }
      } catch (e) {
        console.error('Error parsing images:', e);
      }
      return 'https://via.placeholder.com/300x200?text=No+Image';
    };
    
    const formatPrice = (price) => {
      return parseFloat(price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
    
    return {
      goToDetails,
      getImageUrl,
      formatPrice
    };
  }
};
</script>

<style scoped>
.car-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.car-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.pending {
  background-color: #ffc107;
  color: #000;
}

.status-badge.rejected {
  background-color: #dc3545;
  color: white;
}

.car-info {
  padding: 15px;
}

.car-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #2c3e50;
}

.car-price {
  font-size: 24px;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 15px;
}

.car-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.detail-item {
  font-size: 14px;
  color: #666;
}

.car-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.meta-item {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  text-transform: capitalize;
}

.car-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.car-actions .btn {
  flex: 1;
  padding: 8px;
  font-size: 14px;
}
</style>
