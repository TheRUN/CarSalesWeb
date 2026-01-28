<template>
  <div class="car-form">
    <h2>{{ isEdit ? 'Edit Car Listing' : 'Add New Car Listing' }}</h2>
    
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    
    <form @submit.prevent="submitForm">
      <div class="form-row">
        <div class="form-group">
          <label>Make *</label>
          <input v-model="formData.make" type="text" required placeholder="e.g. Toyota" />
        </div>
        
        <div class="form-group">
          <label>Model *</label>
          <input v-model="formData.model" type="text" required placeholder="e.g. Camry" />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Year *</label>
          <input v-model.number="formData.year" type="number" required min="1900" :max="new Date().getFullYear() + 1" />
        </div>
        
        <div class="form-group">
          <label>Price ($) *</label>
          <input v-model.number="formData.price" type="number" required min="0" step="0.01" />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Mileage (km) *</label>
          <input v-model.number="formData.mileage" type="number" required min="0" />
        </div>
        
        <div class="form-group">
          <label>Color</label>
          <input v-model="formData.color" type="text" placeholder="e.g. Silver" />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Transmission *</label>
          <select v-model="formData.transmission" required>
            <option value="">Select...</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Fuel Type *</label>
          <select v-model="formData.fuel_type" required>
            <option value="">Select...</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Body Type</label>
        <input v-model="formData.body_type" type="text" placeholder="e.g. Sedan, SUV, Coupe" />
      </div>
      
      <div class="form-group">
        <label>Description</label>
        <textarea 
          v-model="formData.description" 
          placeholder="Describe the car's condition, features, history..."
          rows="5"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label>Images (Max 10)</label>
        <input 
          type="file" 
          @change="handleFileChange" 
          multiple 
          accept="image/*"
          ref="fileInput"
        />
        <small>You can upload up to 10 images. Supported formats: JPG, PNG, GIF, WEBP</small>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : (isEdit ? 'Update Car' : 'Add Car') }}
        </button>
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'CarForm',
  props: {
    car: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const formData = ref({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      mileage: '',
      color: '',
      transmission: '',
      fuel_type: '',
      body_type: '',
      description: ''
    });
    
    const files = ref([]);
    const fileInput = ref(null);
    const loading = ref(false);
    const errorMessage = ref('');
    const isEdit = ref(false);
    
    onMounted(() => {
      if (props.car) {
        isEdit.value = true;
        formData.value = {
          make: props.car.make,
          model: props.car.model,
          year: props.car.year,
          price: props.car.price,
          mileage: props.car.mileage,
          color: props.car.color || '',
          transmission: props.car.transmission,
          fuel_type: props.car.fuel_type,
          body_type: props.car.body_type || '',
          description: props.car.description || ''
        };
      }
    });
    
    const handleFileChange = (event) => {
      files.value = Array.from(event.target.files);
      if (files.value.length > 10) {
        errorMessage.value = 'Maximum 10 images allowed';
        files.value = files.value.slice(0, 10);
      }
    };
    
    const submitForm = async () => {
      loading.value = true;
      errorMessage.value = '';
      
      try {
        const formDataToSend = new FormData();
        
        Object.keys(formData.value).forEach(key => {
          if (formData.value[key] !== null && formData.value[key] !== '') {
            formDataToSend.append(key, formData.value[key]);
          }
        });
        
        files.value.forEach(file => {
          formDataToSend.append('images', file);
        });
        
        emit('submit', formDataToSend);
      } catch (error) {
        errorMessage.value = 'Error preparing form data';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      formData,
      files,
      fileInput,
      loading,
      errorMessage,
      isEdit,
      handleFileChange,
      submitForm
    };
  }
};
</script>

<style scoped>
.car-form {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.car-form h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.form-actions button {
  flex: 1;
}

small {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 12px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
