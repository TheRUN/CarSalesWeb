const db = require('../config/database');

class Inquiry {
    static async create(inquiryData) {
        const query = `INSERT INTO inquiries (car_id, name, email, phone, message) 
                       VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [
            inquiryData.car_id,
            inquiryData.name,
            inquiryData.email,
            inquiryData.phone,
            inquiryData.message
        ]);
        return result.insertId;
    }

    static async findById(id) {
        const query = `SELECT i.*, c.make, c.model, c.year 
                       FROM inquiries i 
                       LEFT JOIN cars c ON i.car_id = c.id 
                       WHERE i.id = ?`;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async getByCarId(carId) {
        const query = `SELECT * FROM inquiries WHERE car_id = ? ORDER BY created_at DESC`;
        const [rows] = await db.execute(query, [carId]);
        return rows;
    }

    static async getBySellerId(sellerId) {
        const query = `SELECT i.*, c.make, c.model, c.year, c.seller_id 
                       FROM inquiries i 
                       INNER JOIN cars c ON i.car_id = c.id 
                       WHERE c.seller_id = ? 
                       ORDER BY i.created_at DESC`;
        const [rows] = await db.execute(query, [sellerId]);
        return rows;
    }

    static async getAll() {
        const query = `SELECT i.*, c.make, c.model, c.year, c.seller_id 
                       FROM inquiries i 
                       LEFT JOIN cars c ON i.car_id = c.id 
                       ORDER BY i.created_at DESC`;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async delete(id) {
        const query = 'DELETE FROM inquiries WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Inquiry;
