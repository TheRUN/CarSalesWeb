import apiClient from './api';

export default {
    createInquiry(inquiryData) {
        return apiClient.post('/inquiries', inquiryData);
    },
    
    getInquiriesByCarId(carId) {
        return apiClient.get(`/inquiries/car/${carId}`);
    },
    
    getMyInquiries() {
        return apiClient.get('/inquiries/my-inquiries');
    },
    
    getAllInquiries() {
        return apiClient.get('/inquiries/all');
    },
    
    deleteInquiry(id) {
        return apiClient.delete(`/inquiries/${id}`);
    }
};
