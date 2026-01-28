const { validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');
const Car = require('../models/Car');

exports.createInquiry = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { car_id, name, email, phone, message } = req.body;

        // Check if car exists
        const car = await Car.findById(car_id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const inquiryId = await Inquiry.create({
            car_id,
            name,
            email,
            phone,
            message
        });

        const inquiry = await Inquiry.findById(inquiryId);

        res.status(201).json({
            message: 'Inquiry submitted successfully',
            inquiry
        });
    } catch (error) {
        console.error('Create inquiry error:', error);
        res.status(500).json({ error: 'Server error submitting inquiry' });
    }
};

exports.getInquiriesByCarId = async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Check if user owns the car or is admin
        if (req.user.role !== 'admin' && car.seller_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const inquiries = await Inquiry.getByCarId(req.params.carId);
        res.json(inquiries);
    } catch (error) {
        console.error('Get inquiries error:', error);
        res.status(500).json({ error: 'Server error fetching inquiries' });
    }
};

exports.getMyInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.getBySellerId(req.user.id);
        res.json(inquiries);
    } catch (error) {
        console.error('Get my inquiries error:', error);
        res.status(500).json({ error: 'Server error fetching inquiries' });
    }
};

exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.getAll();
        res.json(inquiries);
    } catch (error) {
        console.error('Get all inquiries error:', error);
        res.status(500).json({ error: 'Server error fetching inquiries' });
    }
};

exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        // Check if user owns the car or is admin
        if (req.user.role !== 'admin' && inquiry.seller_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const deleted = await Inquiry.delete(req.params.id);
        if (!deleted) {
            return res.status(500).json({ error: 'Failed to delete inquiry' });
        }

        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        console.error('Delete inquiry error:', error);
        res.status(500).json({ error: 'Server error deleting inquiry' });
    }
};
