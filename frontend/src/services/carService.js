import apiClient from './api';

export default {
    getAllCars(filters = {}) {
        return apiClient.get('/cars', { params: filters });
    },
    
    getCarById(id) {
        return apiClient.get(`/cars/${id}`);
    },
    
    getMyCars() {
        return apiClient.get('/cars/seller/my-cars');
    },
    
    createCar(carData) {
        return apiClient.post('/cars', carData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    updateCar(id, carData) {
        return apiClient.put(`/cars/${id}`, carData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    deleteCar(id) {
        return apiClient.delete(`/cars/${id}`);
    },
    
    getMakes() {
        return apiClient.get('/cars/makes');
    },
    
    getBodyTypes() {
        return apiClient.get('/cars/body-types');
    }
};
