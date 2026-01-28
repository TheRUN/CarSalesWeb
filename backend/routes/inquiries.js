const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const inquiryController = require('../controllers/inquiryController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public route - submit inquiry
router.post('/', [
    body('car_id').isInt().withMessage('Valid car ID is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('phone').optional().trim(),
    body('message').trim().notEmpty().withMessage('Message is required')
], inquiryController.createInquiry);

// Protected routes
router.get('/car/:carId', authMiddleware, inquiryController.getInquiriesByCarId);
router.get('/my-inquiries', authMiddleware, inquiryController.getMyInquiries);
router.get('/all', authMiddleware, adminMiddleware, inquiryController.getAllInquiries);
router.delete('/:id', authMiddleware, inquiryController.deleteInquiry);

module.exports = router;
