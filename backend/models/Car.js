const db = require('../config/database');

class Car {
    static async create(carData) {
        const query = `INSERT INTO cars (seller_id, make, model, year, price, mileage, color, 
                       transmission, fuel_type, body_type, description, status, images) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [
            carData.seller_id,
            carData.make,
            carData.model,
            carData.year,
            carData.price,
            carData.mileage,
            carData.color,
            carData.transmission,
            carData.fuel_type,
            carData.body_type,
            carData.description,
            carData.status || 'pending',
            carData.images || null
        ]);
        return result.insertId;
    }

    static async findById(id) {
        const query = `SELECT c.*, u.username as seller_name, u.email as seller_email 
                       FROM cars c 
                       LEFT JOIN users u ON c.seller_id = u.id 
                       WHERE c.id = ?`;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async getAll(filters = {}) {
        let query = `SELECT c.*, u.username as seller_name 
                     FROM cars c 
                     LEFT JOIN users u ON c.seller_id = u.id 
                     WHERE 1=1`;
        const params = [];

        if (filters.status) {
            query += ' AND c.status = ?';
            params.push(filters.status);
        }

        if (filters.make) {
            query += ' AND c.make = ?';
            params.push(filters.make);
        }

        if (filters.model) {
            query += ' AND c.model LIKE ?';
            params.push(`%${filters.model}%`);
        }

        if (filters.minPrice) {
            query += ' AND c.price >= ?';
            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            query += ' AND c.price <= ?';
            params.push(filters.maxPrice);
        }

        if (filters.minYear) {
            query += ' AND c.year >= ?';
            params.push(filters.minYear);
        }

        if (filters.maxYear) {
            query += ' AND c.year <= ?';
            params.push(filters.maxYear);
        }

        if (filters.transmission) {
            query += ' AND c.transmission = ?';
            params.push(filters.transmission);
        }

        if (filters.fuel_type) {
            query += ' AND c.fuel_type = ?';
            params.push(filters.fuel_type);
        }

        if (filters.body_type) {
            query += ' AND c.body_type = ?';
            params.push(filters.body_type);
        }

        if (filters.maxMileage) {
            query += ' AND c.mileage <= ?';
            params.push(filters.maxMileage);
        }

        if (filters.search) {
            query += ' AND (c.make LIKE ? OR c.model LIKE ? OR c.description LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // Sorting
        const sortBy = filters.sortBy || 'created_at';
        const sortOrder = filters.sortOrder || 'DESC';
        query += ` ORDER BY c.${sortBy} ${sortOrder}`;

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async getBySellerId(sellerId) {
        const query = `SELECT * FROM cars WHERE seller_id = ? ORDER BY created_at DESC`;
        const [rows] = await db.execute(query, [sellerId]);
        return rows;
    }

    static async update(id, carData) {
        const query = `UPDATE cars SET make = ?, model = ?, year = ?, price = ?, 
                       mileage = ?, color = ?, transmission = ?, fuel_type = ?, 
                       body_type = ?, description = ?, images = ? WHERE id = ?`;
        const [result] = await db.execute(query, [
            carData.make,
            carData.model,
            carData.year,
            carData.price,
            carData.mileage,
            carData.color,
            carData.transmission,
            carData.fuel_type,
            carData.body_type,
            carData.description,
            carData.images,
            id
        ]);
        return result.affectedRows > 0;
    }

    static async updateStatus(id, status) {
        const query = 'UPDATE cars SET status = ? WHERE id = ?';
        const [result] = await db.execute(query, [status, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM cars WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async getMakes() {
        const query = 'SELECT DISTINCT make FROM cars ORDER BY make';
        const [rows] = await db.execute(query);
        return rows.map(row => row.make);
    }

    static async getBodyTypes() {
        const query = 'SELECT DISTINCT body_type FROM cars WHERE body_type IS NOT NULL ORDER BY body_type';
        const [rows] = await db.execute(query);
        return rows.map(row => row.body_type);
    }
}

module.exports = Car;
