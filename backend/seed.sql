-- Seed data for Car Sales Database
-- Run this after setting up the main database schema

USE carsales_db;

-- Create admin user with properly hashed password
-- Password: admin123
-- Note: In production, generate a new hash using bcrypt
DELETE FROM users WHERE email = 'admin@carsales.com';
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@carsales.com', '$2a$10$X3LNNQZOHPMKJc0P1i1KGO8P5vQk5F5wCYH6rQ9J0YC5oC5F5F5F5', 'admin');

-- Create sample seller users
-- Password for all: seller123
INSERT INTO users (username, email, password, role) VALUES 
('john_seller', 'john@example.com', '$2a$10$X3LNNQZOHPMKJc0P1i1KGO8P5vQk5F5wCYH6rQ9J0YC5oC5F5F5F5', 'seller'),
('jane_dealer', 'jane@example.com', '$2a$10$X3LNNQZOHPMKJc0P1i1KGO8P5vQk5F5wCYH6rQ9J0YC5oC5F5F5F5', 'seller');

-- Get user IDs
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@carsales.com');
SET @john_id = (SELECT id FROM users WHERE email = 'john@example.com');
SET @jane_id = (SELECT id FROM users WHERE email = 'jane@example.com');

-- Sample car listings
INSERT INTO cars (seller_id, make, model, year, price, mileage, color, transmission, fuel_type, body_type, description, status) VALUES
-- Toyota vehicles
(@john_id, 'Toyota', 'Camry', 2020, 24999.99, 35000, 'Silver', 'automatic', 'petrol', 'Sedan', 'Well-maintained Toyota Camry in excellent condition. Single owner, full service history. Features include leather seats, navigation system, and backup camera.', 'approved'),
(@john_id, 'Toyota', 'Corolla', 2021, 19999.99, 22000, 'White', 'automatic', 'hybrid', 'Sedan', 'Fuel-efficient hybrid Corolla with low mileage. Perfect for daily commuting. Excellent fuel economy and reliability.', 'approved'),
(@jane_id, 'Toyota', 'RAV4', 2019, 28999.99, 45000, 'Blue', 'automatic', 'petrol', 'SUV', 'Spacious family SUV with AWD. Great for road trips and daily use. Clean interior and exterior.', 'approved'),

-- Honda vehicles
(@john_id, 'Honda', 'Civic', 2021, 22999.99, 28000, 'Blue', 'automatic', 'petrol', 'Sedan', 'Honda Civic with low mileage and full service history. Sport trim with upgraded wheels and premium audio system.', 'approved'),
(@jane_id, 'Honda', 'Accord', 2020, 26999.99, 32000, 'Black', 'automatic', 'petrol', 'Sedan', 'Premium Honda Accord with leather interior. Includes sunroof, heated seats, and advanced safety features.', 'approved'),
(@john_id, 'Honda', 'CR-V', 2022, 32999.99, 15000, 'Gray', 'automatic', 'petrol', 'SUV', 'Nearly new CR-V with very low mileage. Warranty still active. All the latest safety and tech features.', 'approved'),

-- Ford vehicles
(@jane_id, 'Ford', 'Mustang', 2019, 34999.99, 42000, 'Red', 'manual', 'petrol', 'Coupe', 'Sporty Ford Mustang with powerful V8 engine. Great condition, well maintained. Perfect for enthusiasts.', 'approved'),
(@john_id, 'Ford', 'F-150', 2020, 38999.99, 55000, 'Black', 'automatic', 'petrol', 'Truck', 'Reliable work truck with towing package. Crew cab with plenty of space. Great for work or adventure.', 'approved'),
(@jane_id, 'Ford', 'Explorer', 2021, 36999.99, 28000, 'White', 'automatic', 'petrol', 'SUV', 'Three-row SUV perfect for large families. Loaded with features including navigation and rear entertainment.', 'approved'),

-- Chevrolet vehicles
(@john_id, 'Chevrolet', 'Malibu', 2020, 21999.99, 38000, 'Silver', 'automatic', 'petrol', 'Sedan', 'Comfortable midsize sedan with modern features. Apple CarPlay, Android Auto, and excellent safety ratings.', 'approved'),
(@jane_id, 'Chevrolet', 'Silverado', 2019, 35999.99, 48000, 'Blue', 'automatic', 'diesel', 'Truck', 'Heavy-duty Silverado with diesel engine. Excellent for towing and hauling. Well maintained.', 'approved'),

-- BMW vehicles
(@jane_id, 'BMW', '3 Series', 2021, 39999.99, 18000, 'White', 'automatic', 'petrol', 'Sedan', 'Luxury sports sedan with premium features. M Sport package, navigation, and driver assistance systems.', 'approved'),
(@john_id, 'BMW', 'X5', 2020, 52999.99, 25000, 'Black', 'automatic', 'diesel', 'SUV', 'Luxury SUV with all the bells and whistles. Panoramic sunroof, premium sound, and adaptive suspension.', 'approved'),

-- Mercedes-Benz vehicles
(@jane_id, 'Mercedes-Benz', 'C-Class', 2021, 42999.99, 20000, 'Gray', 'automatic', 'petrol', 'Sedan', 'Elegant Mercedes C-Class with premium interior. AMG styling package and advanced tech features.', 'approved'),
(@john_id, 'Mercedes-Benz', 'GLE', 2020, 58999.99, 30000, 'Black', 'automatic', 'diesel', 'SUV', 'Luxurious midsize SUV with cutting-edge technology. Massage seats, air suspension, and premium Burmester sound.', 'approved'),

-- Nissan vehicles
(@john_id, 'Nissan', 'Altima', 2021, 23999.99, 26000, 'Red', 'automatic', 'petrol', 'Sedan', 'Modern Altima with ProPILOT Assist. Great fuel economy and comfortable ride. Well equipped.', 'approved'),
(@jane_id, 'Nissan', 'Rogue', 2022, 29999.99, 12000, 'Blue', 'automatic', 'petrol', 'SUV', 'Compact SUV with excellent safety ratings. Nearly new with low miles. Perfect family vehicle.', 'approved'),

-- Volkswagen vehicles
(@jane_id, 'Volkswagen', 'Golf', 2020, 20999.99, 32000, 'White', 'manual', 'petrol', 'Hatchback', 'Fun-to-drive Golf with manual transmission. Great handling and German engineering quality.', 'approved'),
(@john_id, 'Volkswagen', 'Tiguan', 2021, 31999.99, 24000, 'Gray', 'automatic', 'petrol', 'SUV', 'Stylish compact SUV with premium interior. Third row seating option and digital cockpit.', 'approved'),

-- Hyundai vehicles
(@john_id, 'Hyundai', 'Elantra', 2022, 21999.99, 15000, 'Silver', 'automatic', 'hybrid', 'Sedan', 'New generation Elantra hybrid with excellent fuel economy. Modern design and loaded with tech.', 'approved'),
(@jane_id, 'Hyundai', 'Santa Fe', 2021, 33999.99, 22000, 'Black', 'automatic', 'petrol', 'SUV', 'Three-row SUV with impressive warranty. Comfortable and well-equipped for family adventures.', 'approved'),

-- Tesla vehicles
(@jane_id, 'Tesla', 'Model 3', 2021, 45999.99, 18000, 'White', 'automatic', 'electric', 'Sedan', 'All-electric sedan with autopilot. Long range battery, supercharger access, and over-the-air updates.', 'approved'),
(@john_id, 'Tesla', 'Model Y', 2022, 54999.99, 8000, 'Blue', 'automatic', 'electric', 'SUV', 'Nearly new Model Y with full self-driving capability. Spacious interior and impressive range.', 'approved'),

-- Pending approval cars (for demo)
(@john_id, 'Mazda', 'CX-5', 2021, 27999.99, 28000, 'Red', 'automatic', 'petrol', 'SUV', 'Stylish and fun-to-drive SUV. Great handling and premium interior. Awaiting approval.', 'pending'),
(@jane_id, 'Kia', 'Sorento', 2022, 34999.99, 12000, 'Gray', 'automatic', 'hybrid', 'SUV', 'New Sorento hybrid with three rows. Modern design and excellent warranty. Pending review.', 'pending');

-- Sample inquiries
SET @camry_id = (SELECT id FROM cars WHERE make = 'Toyota' AND model = 'Camry' LIMIT 1);
SET @civic_id = (SELECT id FROM cars WHERE make = 'Honda' AND model = 'Civic' LIMIT 1);
SET @mustang_id = (SELECT id FROM cars WHERE make = 'Ford' AND model = 'Mustang' LIMIT 1);
SET @model3_id = (SELECT id FROM cars WHERE make = 'Tesla' AND model = 'Model 3' LIMIT 1);

INSERT INTO inquiries (car_id, name, email, phone, message) VALUES
(@camry_id, 'Michael Brown', 'michael@example.com', '555-0101', 'Hi, I am interested in this Camry. Is it still available? Can I schedule a test drive?'),
(@camry_id, 'Sarah Johnson', 'sarah@example.com', '555-0102', 'Does this car have any accident history? What is the condition of the tires?'),
(@civic_id, 'David Lee', 'david@example.com', '555-0103', 'Interested in this Civic. Can you provide more details about the service history?'),
(@mustang_id, 'Emily Davis', 'emily@example.com', '555-0104', 'I love this Mustang! Is the price negotiable? Would like to see it this weekend.'),
(@model3_id, 'Robert Wilson', 'robert@example.com', '555-0105', 'Very interested in the Model 3. Does it include the premium connectivity subscription?');

SELECT 'Database seeded successfully!' as Message;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Cars' FROM cars;
SELECT COUNT(*) as 'Approved Cars' FROM cars WHERE status = 'approved';
SELECT COUNT(*) as 'Pending Cars' FROM cars WHERE status = 'pending';
SELECT COUNT(*) as 'Total Inquiries' FROM inquiries;
