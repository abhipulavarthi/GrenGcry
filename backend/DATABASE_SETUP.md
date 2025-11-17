# Database Setup Guide for GrenGcry

## Quick Setup

### 1. Connect to MySQL

```bash
mysql -u root -p
# Enter your password: 1691
```

### 2. Run the Schema File

```bash
# From MySQL command line
source x:/PX/GrenGcry/backend/schema.sql

# OR from terminal
mysql -u root -p1691 < x:/PX/GrenGcry/backend/schema.sql
```

### 3. Verify Tables Created

```sql
USE grengcry;
SHOW TABLES;
```

You should see:
- users
- products
- orders
- order_items
- feedback

## Tables Overview

### **users**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment primary key |
| name | VARCHAR(255) | User's full name |
| email | VARCHAR(255) | Unique email address |
| password | VARCHAR(255) | BCrypt hashed password |
| role | VARCHAR(50) | CUSTOMER, ADMIN, or SALESPERSON |
| created_at | TIMESTAMP | Auto-generated creation time |
| updated_at | TIMESTAMP | Auto-updated modification time |

**Indexes**: email, role

---

### **products**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment primary key |
| name | VARCHAR(255) | Product name |
| description | TEXT | Product description |
| category | VARCHAR(255) | Product category |
| price | DECIMAL(10,2) | Product price (must be positive) |
| stock | INT | Available stock (must be >= 0) |
| image | VARCHAR(500) | Image filename |
| created_at | TIMESTAMP | Auto-generated creation time |
| updated_at | TIMESTAMP | Auto-updated modification time |

**Indexes**: category, name, price, created_at  
**Constraints**: price > 0, stock >= 0

---

### **orders**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment primary key |
| user_id | BIGINT (FK) | References users(id) |
| total | DECIMAL(10,2) | Order total amount |
| status | VARCHAR(50) | PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED |
| created_at | TIMESTAMP | Auto-generated creation time |
| updated_at | TIMESTAMP | Auto-updated modification time |

**Indexes**: user_id, status, created_at  
**Foreign Keys**: user_id → users(id) (CASCADE DELETE)  
**Constraints**: total > 0

---

### **order_items**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment primary key |
| order_id | BIGINT (FK) | References orders(id) |
| product_id | BIGINT (FK) | References products(id) |
| quantity | INT | Quantity ordered (must be >= 1) |
| price | DECIMAL(10,2) | Price at time of order |

**Indexes**: order_id, product_id  
**Foreign Keys**: 
- order_id → orders(id) (CASCADE DELETE)
- product_id → products(id) (RESTRICT DELETE)  
**Constraints**: quantity >= 1, price > 0

---

### **feedback**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment primary key |
| user_id | BIGINT (FK) | References users(id) |
| rating | INT | Rating 1-5 |
| comment | TEXT | Feedback comment |
| created_at | TIMESTAMP | Auto-generated creation time |
| updated_at | TIMESTAMP | Auto-updated modification time |

**Indexes**: user_id, rating, created_at  
**Foreign Keys**: user_id → users(id) (CASCADE DELETE)  
**Constraints**: rating BETWEEN 1 AND 5

---

## Entity Relationships

```
users (1) ─── (N) orders
users (1) ─── (N) feedback

orders (1) ─── (N) order_items

products (1) ─── (N) order_items
```

## Sample Queries

### Create Admin User Manually

```sql
-- Insert admin user (you'll need to hash the password in the application)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@grengcry.com', '$2a$10$hashed_password', 'ADMIN');
```

### View All Products

```sql
SELECT * FROM products ORDER BY created_at DESC;
```

### View Orders with User Info

```sql
SELECT 
    o.id, 
    u.name as customer_name, 
    o.total, 
    o.status, 
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;
```

### View Order Details with Items

```sql
SELECT 
    o.id as order_id,
    u.name as customer,
    p.name as product,
    oi.quantity,
    oi.price,
    o.status
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.id = 1;
```

### Average Rating

```sql
SELECT AVG(rating) as average_rating, COUNT(*) as total_feedback
FROM feedback;
```

### Products Low in Stock

```sql
SELECT name, category, stock, price
FROM products
WHERE stock < 10
ORDER BY stock ASC;
```

### Total Revenue

```sql
SELECT SUM(total) as total_revenue
FROM orders
WHERE status = 'DELIVERED';
```

### Best Selling Products

```sql
SELECT 
    p.name,
    SUM(oi.quantity) as total_sold,
    SUM(oi.quantity * oi.price) as revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;
```

## Views Available (in schema.sql)

The full schema includes these views:

1. **order_statistics** - Daily order stats by status
2. **product_sales** - Product sales summary
3. **user_order_summary** - User purchase history
4. **feedback_summary** - Rating distribution

### Using Views

```sql
-- View order statistics
SELECT * FROM order_statistics;

-- View product sales
SELECT * FROM product_sales ORDER BY total_revenue DESC;

-- View user summaries
SELECT * FROM user_order_summary ORDER BY total_spent DESC;

-- View feedback summary
SELECT * FROM feedback_summary;
```

## Stored Procedures (in schema.sql)

### Get Low Stock Products

```sql
CALL GetLowStockProducts(10);  -- Products with stock <= 10
```

### Get User Order History

```sql
CALL GetUserOrderHistory(1);  -- Orders for user ID 1
```

## Database Maintenance

### Backup Database

```bash
# Windows Command Prompt
mysqldump -u root -p1691 -P 6969 grengcry > grengcry_backup.sql
```

### Restore Database

```bash
# Windows Command Prompt
mysql -u root -p1691 -P 6969 grengcry < grengcry_backup.sql
```

### Check Table Status

```sql
SHOW TABLE STATUS FROM grengcry;
```

### Optimize Tables

```sql
OPTIMIZE TABLE users, products, orders, order_items, feedback;
```

### Check Database Size

```sql
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES
WHERE table_schema = 'grengcry'
ORDER BY (data_length + index_length) DESC;
```

## Troubleshooting

### Can't Connect to MySQL

```bash
# Check if MySQL is running
net start | findstr MySQL

# Start MySQL service
net start MySQL80
```

### Permission Denied

```sql
-- Grant all privileges
GRANT ALL PRIVILEGES ON grengcry.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Foreign Key Constraint Fails

Make sure you insert data in this order:
1. users
2. products
3. orders
4. order_items
5. feedback

### Reset Database

```sql
DROP DATABASE grengcry;
CREATE DATABASE grengcry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Then run schema.sql again
```

## Connection String

Your application.properties is configured as:

```properties
spring.datasource.url=jdbc:mysql://localhost:6969/grengcry?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=1691
```

## Schema Files

- **schema.sql** - Complete schema with sample data, views, procedures, and triggers
- **schema-minimal.sql** - Just the table definitions (clean slate)

Choose based on your needs:
- Use **schema.sql** for development with sample data
- Use **schema-minimal.sql** for production (empty tables)
