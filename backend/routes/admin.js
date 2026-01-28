const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All routes require admin authentication
router.use(authMiddleware);
router.use(adminMiddleware);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', [
    body('status').isIn(['active', 'disabled']).withMessage('Invalid status')
], adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Car management
router.put('/cars/:id/status', [
    body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
], adminController.updateCarStatus);

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
