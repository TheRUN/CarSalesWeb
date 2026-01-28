<template>
  <div class="search-filter">
    <h2>Search & Filter</h2>
    
    <div class="filter-section">
      <div class="form-group">
        <label>Search</label>
        <input 
          v-model="filters.search" 
          type="text" 
          placeholder="Search by make, model, or keywords..."
          @input="emitFilters"
        />
      </div>
      
      <div class="form-group">
        <label>Make</label>
        <select v-model="filters.make" @change="emitFilters">
          <option value="">All Makes</option>
          <option v-for="make in makes" :key="make" :value="make">{{ make }}</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Body Type</label>
        <select v-model="filters.body_type" @change="emitFilters">
          <option value="">All Types</option>
          <option v-for="type in bodyTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Transmission</label>
        <select v-model="filters.transmission" @change="emitFilters">
          <option value="">All</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Fuel Type</label>
        <select v-model="filters.fuel_type" @change="emitFilters">
          <option value="">All</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Min Price</label>
          <input 
            v-model.number="filters.minPrice" 
            type="number" 
            placeholder="Min"
            @input="emitFilters"
          />
        </div>
        
        <div class="form-group">
          <label>Max Price</label>
          <input 
            v-model.number="filters.maxPrice" 
            type="number" 
            placeholder="Max"
            @input="emitFilters"
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Min Year</label>
          <input 
            v-model.number="filters.minYear" 
            type="number" 
            placeholder="Min"
            @input="emitFilters"
          />
        </div>
        
        <div class="form-group">
          <label>Max Year</label>
          <input 
            v-model.number="filters.maxYear" 
            type="number" 
            placeholder="Max"
            @input="emitFilters"
          />
        </div>
      </div>
      
      <div class="form-group">
        <label>Max Mileage (km)</label>
        <input 
          v-model.number="filters.maxMileage" 
          type="number" 
          placeholder="Maximum mileage"
          @input="emitFilters"
        />
      </div>
      
      <div class="form-group">
        <label>Sort By</label>
        <select v-model="filters.sortBy" @change="emitFilters">
          <option value="created_at">Newest First</option>
          <option value="price">Price</option>
          <option value="year">Year</option>
          <option value="mileage">Mileage</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Sort Order</label>
        <select v-model="filters.sortOrder" @change="emitFilters">
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
      </div>
      
      <button @click="resetFilters" class="btn btn-secondary">Reset Filters</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import carService from '../services/carService';

export default {
  name: 'SearchFilter',
  emits: ['filter-change'],
  setup(props, { emit }) {
    const filters = ref({
      search: '',
      make: '',
      body_type: '',
      transmission: '',
      fuel_type: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      maxMileage: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
    
    const makes = ref([]);
    const bodyTypes = ref([]);
    
    const fetchMakes = async () => {
      try {
        const response = await carService.getMakes();
        makes.value = response.data;
      } catch (error) {
        console.error('Error fetching makes:', error);
      }
    };
    
    const fetchBodyTypes = async () => {
      try {
        const response = await carService.getBodyTypes();
        bodyTypes.value = response.data;
      } catch (error) {
        console.error('Error fetching body types:', error);
      }
    };
    
    const emitFilters = () => {
      const cleanFilters = {};
      Object.keys(filters.value).forEach(key => {
        if (filters.value[key] !== '' && filters.value[key] !== null) {
          cleanFilters[key] = filters.value[key];
        }
      });
      emit('filter-change', cleanFilters);
    };
    
    const resetFilters = () => {
      filters.value = {
        search: '',
        make: '',
        body_type: '',
        transmission: '',
        fuel_type: '',
        minPrice: '',
        maxPrice: '',
        minYear: '',
        maxYear: '',
        maxMileage: '',
        sortBy: 'created_at',
        sortOrder: 'DESC'
      };
      emitFilters();
    };
    
    onMounted(() => {
      fetchMakes();
      fetchBodyTypes();
    });
    
    return {
      filters,
      makes,
      bodyTypes,
      emitFilters,
      resetFilters
    };
  }
};
</script>

<style scoped>
.search-filter {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-filter h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
