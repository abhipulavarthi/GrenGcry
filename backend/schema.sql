-- ============================================
-- GrenGcry E-Commerce Database Schema (MySQL)
-- ============================================

-- Create Database (if not exists)
CREATE DATABASE IF NOT EXISTS grengcry 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE grengcry;

-- ============================================
-- Drop Tables (if exists) - in correct order
-- ============================================
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: products
-- ============================================
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_name (name),
    INDEX idx_price (price),
    INDEX idx_created_at (created_at),
    
    CONSTRAINT chk_price_positive CHECK (price > 0),
    CONSTRAINT chk_stock_non_negative CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: orders
-- ============================================
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    
    CONSTRAINT fk_orders_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT chk_total_positive CHECK (total > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: order_items
-- ============================================
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    
    CONSTRAINT fk_order_items_order 
        FOREIGN KEY (order_id) 
        REFERENCES orders(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_order_items_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT chk_quantity_positive CHECK (quantity >= 1),
    CONSTRAINT chk_item_price_positive CHECK (price > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: feedback
-- ============================================
CREATE TABLE feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at),
    
    CONSTRAINT fk_feedback_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert Sample Data (Optional)
-- ============================================

-- Sample Admin User (password: Admin@123)
-- Note: Password is BCrypt hashed
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@grengcry.com', '$2a$10$YourBCryptHashHere', 'ADMIN'),
('John Doe', 'john@example.com', '$2a$10$YourBCryptHashHere', 'CUSTOMER'),
('Jane Smith', 'jane@example.com', '$2a$10$YourBCryptHashHere', 'SALESPERSON');

-- Sample Products
INSERT INTO products (name, description, category, price, stock, image) VALUES
('MacBook Pro M2', 'High-performance laptop with M2 chip', 'Electronics', 1299.99, 50, 'macbook.jpg'),
('iPhone 14 Pro', 'Latest iPhone with advanced camera system', 'Electronics', 999.99, 100, 'iphone14.jpg'),
('Samsung Galaxy S23', 'Flagship Android smartphone', 'Electronics', 899.99, 75, 'samsung-s23.jpg'),
('Dell XPS 15', 'Premium Windows laptop', 'Electronics', 1499.99, 30, 'dell-xps.jpg'),
('Sony WH-1000XM5', 'Noise-canceling headphones', 'Audio', 349.99, 200, 'sony-headphones.jpg'),
('AirPods Pro', 'Wireless earbuds with ANC', 'Audio', 249.99, 150, 'airpods.jpg'),
('iPad Air', 'Versatile tablet for work and play', 'Tablets', 599.99, 80, 'ipad-air.jpg'),
('Samsung Galaxy Tab S8', 'Premium Android tablet', 'Tablets', 649.99, 60, 'galaxy-tab.jpg'),
('Canon EOS R6', 'Full-frame mirrorless camera', 'Cameras', 2499.99, 20, 'canon-r6.jpg'),
('GoPro Hero 11', 'Action camera for adventures', 'Cameras', 399.99, 100, 'gopro-hero11.jpg');

-- Sample Orders
INSERT INTO orders (user_id, total, status) VALUES
(2, 1299.99, 'DELIVERED'),
(2, 599.98, 'SHIPPED'),
(3, 2499.99, 'PROCESSING');

-- Sample Order Items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1299.99),
(2, 5, 1, 349.99),
(2, 6, 1, 249.99),
(3, 9, 1, 2499.99);

-- Sample Feedback
INSERT INTO feedback (user_id, rating, comment) VALUES
(2, 5, 'Excellent service! Product arrived on time and in perfect condition.'),
(3, 4, 'Good quality products, but shipping took a bit longer than expected.'),
(2, 5, 'Love the MacBook! Fast delivery and great customer support.');

-- ============================================
-- Views for Analytics (Optional)
-- ============================================

-- View: Order Statistics
CREATE OR REPLACE VIEW order_statistics AS
SELECT 
    DATE(created_at) as order_date,
    COUNT(*) as total_orders,
    SUM(total) as total_revenue,
    AVG(total) as average_order_value,
    status
FROM orders
GROUP BY DATE(created_at), status;

-- View: Product Sales
CREATE OR REPLACE VIEW product_sales AS
SELECT 
    p.id,
    p.name,
    p.category,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.quantity * oi.price) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.category;

-- View: User Order Summary
CREATE OR REPLACE VIEW user_order_summary AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email;

-- View: Average Feedback Rating
CREATE OR REPLACE VIEW feedback_summary AS
SELECT 
    AVG(rating) as average_rating,
    COUNT(*) as total_feedback,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star_count,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star_count,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star_count,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star_count,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star_count
FROM feedback;

-- ============================================
-- Stored Procedures (Optional)
-- ============================================

-- Procedure: Get Low Stock Products
DELIMITER //
CREATE PROCEDURE GetLowStockProducts(IN threshold INT)
BEGIN
    SELECT 
        id,
        name,
        category,
        stock,
        price
    FROM products
    WHERE stock <= threshold
    ORDER BY stock ASC;
END //
DELIMITER ;

-- Procedure: Get User Order History
DELIMITER //
CREATE PROCEDURE GetUserOrderHistory(IN userId BIGINT)
BEGIN
    SELECT 
        o.id as order_id,
        o.total,
        o.status,
        o.created_at,
        COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = userId
    GROUP BY o.id, o.total, o.status, o.created_at
    ORDER BY o.created_at DESC;
END //
DELIMITER ;

-- ============================================
-- Triggers (Optional)
-- ============================================

-- Trigger: Update product stock after order item insertion
DELIMITER //
CREATE TRIGGER after_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
END //
DELIMITER ;

-- Trigger: Restore product stock after order item deletion
DELIMITER //
CREATE TRIGGER after_order_item_delete
AFTER DELETE ON order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock + OLD.quantity
    WHERE id = OLD.product_id;
END //
DELIMITER ;

-- ============================================
-- Database Verification Queries
-- ============================================

-- Show all tables
SHOW TABLES;

-- Show table structures
-- DESCRIBE users;
-- DESCRIBE products;
-- DESCRIBE orders;
-- DESCRIBE order_items;
-- DESCRIBE feedback;

-- Show indexes
-- SHOW INDEX FROM products;
-- SHOW INDEX FROM orders;

-- ============================================
-- Performance Optimization
-- ============================================

-- Analyze tables for query optimization
ANALYZE TABLE users;
ANALYZE TABLE products;
ANALYZE TABLE orders;
ANALYZE TABLE order_items;
ANALYZE TABLE feedback;

-- ============================================
-- Security - Create Application User (Optional)
-- ============================================

-- Create dedicated user for application
-- CREATE USER 'grengcry_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON grengcry.* TO 'grengcry_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- Backup Command (Run from terminal)
-- ============================================
-- mysqldump -u root -p grengcry > grengcry_backup.sql

-- ============================================
-- Restore Command (Run from terminal)
-- ============================================
-- mysql -u root -p grengcry < grengcry_backup.sql

-- ============================================
-- END OF SCHEMA
-- ============================================
