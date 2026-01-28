const User = require('../models/User');
const Car = require('../models/Car');
const Inquiry = require('../models/Inquiry');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Server error fetching users' });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['active', 'disabled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updated = await User.updateStatus(req.params.id, status);
        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ error: 'Server error updating user status' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error deleting user' });
    }
};

exports.updateCarStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updated = await Car.updateStatus(req.params.id, status);
        if (!updated) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.json({ message: 'Car status updated successfully' });
    } catch (error) {
        console.error('Update car status error:', error);
        res.status(500).json({ error: 'Server error updating car status' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const users = await User.getAll();
        const allCars = await Car.getAll({});
        const inquiries = await Inquiry.getAll();

        const stats = {
            totalUsers: users.length,
            totalCars: allCars.length,
            pendingCars: allCars.filter(car => car.status === 'pending').length,
            approvedCars: allCars.filter(car => car.status === 'approved').length,
            rejectedCars: allCars.filter(car => car.status === 'rejected').length,
            totalInquiries: inquiries.length
        };

        res.json(stats);
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Server error fetching stats' });
    }
};
