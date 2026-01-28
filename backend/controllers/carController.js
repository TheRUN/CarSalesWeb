const { validationResult } = require('express-validator');
const Car = require('../models/Car');
const path = require('path');
const fs = require('fs');

exports.createCar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const carData = {
            ...req.body,
            seller_id: req.user.id,
            images: req.files ? JSON.stringify(req.files.map(f => f.filename)) : null
        };

        const carId = await Car.create(carData);
        const car = await Car.findById(carId);

        res.status(201).json({
            message: 'Car listing created successfully',
            car
        });
    } catch (error) {
        console.error('Create car error:', error);
        res.status(500).json({ error: 'Server error creating car listing' });
    }
};

exports.getAllCars = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            make: req.query.make,
            model: req.query.model,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            minYear: req.query.minYear,
            maxYear: req.query.maxYear,
            transmission: req.query.transmission,
            fuel_type: req.query.fuel_type,
            body_type: req.query.body_type,
            maxMileage: req.query.maxMileage,
            search: req.query.search,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        // For non-authenticated or non-admin users, only show approved cars
        const isAdmin = req.user && req.user.role === 'admin';
        if (!isAdmin) {
            filters.status = 'approved';
        }

        const cars = await Car.getAll(filters);
        res.json(cars);
    } catch (error) {
        console.error('Get all cars error:', error);
        res.status(500).json({ error: 'Server error fetching cars' });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Check permissions for non-approved cars
        if (car.status !== 'approved') {
            const isAuthenticated = req.user !== undefined;
            const isAdmin = isAuthenticated && req.user.role === 'admin';
            const isOwner = isAuthenticated && req.user.id === car.seller_id;
            
            if (!isAdmin && !isOwner) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        res.json(car);
    } catch (error) {
        console.error('Get car error:', error);
        res.status(500).json({ error: 'Server error fetching car' });
    }
};

exports.getMyCars = async (req, res) => {
    try {
        const cars = await Car.getBySellerId(req.user.id);
        res.json(cars);
    } catch (error) {
        console.error('Get my cars error:', error);
        res.status(500).json({ error: 'Server error fetching your cars' });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Check ownership using strict equality
        if (req.user.role !== 'admin' && car.seller_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only edit your own listings' });
        }

        const carData = { ...req.body };
        
        // Handle image updates
        if (req.files && req.files.length > 0) {
            // Delete old images if new ones are uploaded
            if (car.images) {
                try {
                    const oldImages = JSON.parse(car.images);
                    oldImages.forEach(image => {
                        const imagePath = path.join(__dirname, '../uploads', image);
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    });
                } catch (err) {
                    console.error('Error deleting old images:', err);
                }
            }
            carData.images = JSON.stringify(req.files.map(f => f.filename));
        } else if (car.images) {
            carData.images = car.images;
        }

        const updated = await Car.update(req.params.id, carData);
        if (!updated) {
            return res.status(500).json({ error: 'Failed to update car' });
        }

        const updatedCar = await Car.findById(req.params.id);
        res.json({
            message: 'Car updated successfully',
            car: updatedCar
        });
    } catch (error) {
        console.error('Update car error:', error);
        res.status(500).json({ error: 'Server error updating car' });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Check ownership using strict equality
        if (req.user.role !== 'admin' && car.seller_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own listings' });
        }

        // Delete associated images
        if (car.images) {
            try {
                const images = JSON.parse(car.images);
                images.forEach(image => {
                    const imagePath = path.join(__dirname, '../uploads', image);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });
            } catch (err) {
                console.error('Error deleting images:', err);
            }
        }

        const deleted = await Car.delete(req.params.id);
        if (!deleted) {
            return res.status(500).json({ error: 'Failed to delete car' });
        }

        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Delete car error:', error);
        res.status(500).json({ error: 'Server error deleting car' });
    }
};

exports.getMakes = async (req, res) => {
    try {
        const makes = await Car.getMakes();
        res.json(makes);
    } catch (error) {
        console.error('Get makes error:', error);
        res.status(500).json({ error: 'Server error fetching makes' });
    }
};

exports.getBodyTypes = async (req, res) => {
    try {
        const bodyTypes = await Car.getBodyTypes();
        res.json(bodyTypes);
    } catch (error) {
        console.error('Get body types error:', error);
        res.status(500).json({ error: 'Server error fetching body types' });
    }
};
