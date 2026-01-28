-- Car Sales Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS carsales_db;
USE carsales_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('seller', 'admin') DEFAULT 'seller',
    status ENUM('active', 'disabled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    mileage INT NOT NULL,
    color VARCHAR(30),
    transmission ENUM('automatic', 'manual') NOT NULL,
    fuel_type ENUM('petrol', 'diesel', 'electric', 'hybrid') NOT NULL,
    body_type VARCHAR(50),
    description TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    images TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_make (make),
    INDEX idx_model (model),
    INDEX idx_year (year),
    INDEX idx_price (price),
    INDEX idx_status (status)
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_car_id (car_id)
);

-- Insert default admin user (password: admin123)
-- Note: In production, change this password immediately after first login
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@carsales.com', '$2a$10$8K1p/a0dL3.sDxkU5M3C9ufIv2qJPuOZKL1qv4hVQaVvz5kH5KL5G', 'admin');

-- Sample data for cars (optional)
INSERT INTO cars (seller_id, make, model, year, price, mileage, color, transmission, fuel_type, body_type, description, status) VALUES
(1, 'Toyota', 'Camry', 2020, 24999.99, 35000, 'Silver', 'automatic', 'petrol', 'Sedan', 'Well-maintained Toyota Camry in excellent condition', 'approved'),
(1, 'Honda', 'Civic', 2021, 22999.99, 28000, 'Blue', 'automatic', 'petrol', 'Sedan', 'Honda Civic with low mileage and full service history', 'approved'),
(1, 'Ford', 'Mustang', 2019, 34999.99, 42000, 'Red', 'manual', 'petrol', 'Coupe', 'Sporty Ford Mustang with powerful engine', 'approved');
