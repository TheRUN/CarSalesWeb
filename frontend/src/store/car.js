import { defineStore } from 'pinia';
import carService from '../services/carService';

export const useCarStore = defineStore('car', {
    state: () => ({
        cars: [],
        selectedCar: null,
        makes: [],
        bodyTypes: [],
        loading: false
    }),
    
    actions: {
        async fetchCars(filters = {}) {
            this.loading = true;
            try {
                const response = await carService.getAllCars(filters);
                this.cars = response.data;
                return response.data;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        
        async fetchCarById(id) {
            this.loading = true;
            try {
                const response = await carService.getCarById(id);
                this.selectedCar = response.data;
                return response.data;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        
        async fetchMakes() {
            try {
                const response = await carService.getMakes();
                this.makes = response.data;
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        
        async fetchBodyTypes() {
            try {
                const response = await carService.getBodyTypes();
                this.bodyTypes = response.data;
                return response.data;
            } catch (error) {
                throw error;
            }
        }
    }
});
