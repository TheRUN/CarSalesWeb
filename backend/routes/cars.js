const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const carController = require('../controllers/carController');
const { authMiddleware, sellerMiddleware } = require('../middleware/auth');
const { createLimiter } = require('../middleware/rateLimiter');
const upload = require('../config/upload');

// Public routes
router.get('/', carController.getAllCars);
router.get('/makes', carController.getMakes);
router.get('/body-types', carController.getBodyTypes);
router.get('/:id', carController.getCarById);

// Protected routes (sellers and admins) with rate limiting
router.post('/', authMiddleware, sellerMiddleware, createLimiter, upload.array('images', 10), [
    body('make').trim().notEmpty().withMessage('Make is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('mileage').isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
    body('transmission').isIn(['automatic', 'manual']).withMessage('Invalid transmission type'),
    body('fuel_type').isIn(['petrol', 'diesel', 'electric', 'hybrid']).withMessage('Invalid fuel type')
], carController.createCar);

router.get('/seller/my-cars', authMiddleware, sellerMiddleware, carController.getMyCars);

router.put('/:id', authMiddleware, sellerMiddleware, createLimiter, upload.array('images', 10), [
    body('make').trim().notEmpty().withMessage('Make is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('mileage').isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
    body('transmission').isIn(['automatic', 'manual']).withMessage('Invalid transmission type'),
    body('fuel_type').isIn(['petrol', 'diesel', 'electric', 'hybrid']).withMessage('Invalid fuel type')
], carController.updateCar);

router.delete('/:id', authMiddleware, sellerMiddleware, carController.deleteCar);

module.exports = router;
