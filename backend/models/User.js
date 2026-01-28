const db = require('../config/database');

class User {
    static async create(userData) {
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(query, [
            userData.username,
            userData.email,
            userData.password,
            userData.role || 'seller'
        ]);
        return result.insertId;
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    }

    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.execute(query, [username]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, username, email, role, status, created_at FROM users WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async getAll() {
        const query = 'SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async updateStatus(id, status) {
        const query = 'UPDATE users SET status = ? WHERE id = ?';
        const [result] = await db.execute(query, [status, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = User;
