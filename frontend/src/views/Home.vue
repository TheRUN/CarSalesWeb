<template>
  <div class="home">
    <div class="hero">
      <h1>Find Your Dream Car</h1>
      <p>Browse through our extensive collection of quality used cars</p>
    </div>
    
    <div class="content-layout">
      <aside class="sidebar">
        <SearchFilter @filter-change="handleFilterChange" />
      </aside>
      
      <main class="main-content-area">
        <div class="results-header">
          <h2>Available Cars ({{ cars.length }})</h2>
        </div>
        
        <div v-if="loading" class="loading">Loading cars...</div>
        
        <div v-else-if="cars.length === 0" class="no-results">
          <p>No cars found matching your criteria.</p>
        </div>
        
        <div v-else class="car-grid">
          <CarCard 
            v-for="car in cars" 
            :key="car.id" 
            :car="car" 
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import CarCard from '../components/CarCard.vue';
import SearchFilter from '../components/SearchFilter.vue';
import carService from '../services/carService';

export default {
  name: 'Home',
  components: {
    CarCard,
    SearchFilter
  },
  setup() {
    const cars = ref([]);
    const loading = ref(false);
    const currentFilters = ref({});
    
    const fetchCars = async (filters = {}) => {
      loading.value = true;
      try {
        const response = await carService.getAllCars(filters);
        cars.value = response.data;
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const handleFilterChange = (filters) => {
      currentFilters.value = filters;
      fetchCars(filters);
    };
    
    onMounted(() => {
      fetchCars();
    });
    
    return {
      cars,
      loading,
      handleFilterChange
    };
  }
};
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  margin: -20px -20px 30px -20px;
  border-radius: 0 0 20px 20px;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 15px;
}

.hero p {
  font-size: 20px;
  opacity: 0.9;
}

.content-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

.sidebar {
  position: sticky;
  top: 20px;
  align-self: start;
}

.results-header {
  margin-bottom: 20px;
}

.results-header h2 {
  color: #2c3e50;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: static;
  }
  
  .hero h1 {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 20px;
    margin: -10px -10px 20px -10px;
  }
  
  .hero h1 {
    font-size: 28px;
  }
  
  .hero p {
    font-size: 16px;
  }
  
  .car-grid {
    grid-template-columns: 1fr;
  }
}
</style>
