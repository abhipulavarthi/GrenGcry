# API Examples & Testing

Complete examples for testing all API endpoints using curl.

## Authentication

### Register New User
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  },
  "error": null
}
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## Products

### Get All Products
```bash
# Basic request
curl http://localhost:8080/api/products

# With pagination
curl "http://localhost:8080/api/products?page=1&limit=10"

# Filter by category
curl "http://localhost:8080/api/products?category=Electronics"

# Search products
curl "http://localhost:8080/api/products?search=laptop"

# Sort by price
curl "http://localhost:8080/api/products?sort=price_asc"
curl "http://localhost:8080/api/products?sort=price_desc"

# Sort by newest
curl "http://localhost:8080/api/products?sort=newest"

# Combined filters
curl "http://localhost:8080/api/products?category=Electronics&search=laptop&sort=price_asc&page=1&limit=10"
```

### Get Product by ID
```bash
curl http://localhost:8080/api/products/1
```

### Create Product (Admin Only)
```bash
# With image
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=MacBook Pro" \
  -F "description=High-performance laptop" \
  -F "category=Electronics" \
  -F "price=1299.99" \
  -F "stock=50" \
  -F "image=@/path/to/image.jpg"

# Without image
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=MacBook Pro" \
  -F "description=High-performance laptop" \
  -F "category=Electronics" \
  -F "price=1299.99" \
  -F "stock=50"
```

### Update Product (Admin Only)
```bash
# Update specific fields
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "price=1199.99" \
  -F "stock=45"

# Update with new image
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=MacBook Pro M2" \
  -F "price=1399.99" \
  -F "image=@/path/to/new-image.jpg"
```

### Delete Product (Admin Only)
```bash
curl -X DELETE http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Orders

### Get All Orders
```bash
# Customer sees only their orders
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/orders

# With pagination
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8080/api/orders?page=1&limit=10"

# Filter by status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8080/api/orders?status=PENDING"

# Admin/Salesperson sees all orders
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:8080/api/orders?status=DELIVERED"
```

### Get Order by ID
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/orders/1
```

### Create Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "productId": 1,
        "quantity": 2
      },
      {
        "productId": 3,
        "quantity": 1
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "MacBook Pro",
          "price": 1299.99
        },
        "quantity": 2,
        "price": 1299.99
      }
    ],
    "total": 2599.98,
    "status": "PENDING",
    "createdAt": "2024-01-01T10:00:00"
  }
}
```

### Update Order Status (Admin/Salesperson Only)
```bash
# Update to PROCESSING
curl -X PUT http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PROCESSING"
  }'

# Update to SHIPPED
curl -X PUT http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SHIPPED"
  }'

# Update to DELIVERED
curl -X PUT http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DELIVERED"
  }'

# Update to CANCELLED
curl -X PUT http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CANCELLED"
  }'
```

## Feedback

### Get All Feedback (Admin Only)
```bash
# Get all feedback
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:8080/api/feedback

# With pagination
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:8080/api/feedback?page=1&limit=10"

# Filter by rating
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:8080/api/feedback?rating=5"
```

### Create Feedback
```bash
curl -X POST http://localhost:8080/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Great service! Very satisfied with my purchase."
  }'
```

### Delete Feedback (Admin Only)
```bash
curl -X DELETE http://localhost:8080/api/feedback/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Users (Admin Only)

### Get All Users
```bash
# Get all users
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:8080/api/users

# With pagination
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:8080/api/users?page=1&limit=10"

# Filter by role
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:8080/api/users?role=CUSTOMER"
```

### Get User by ID
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:8080/api/users/1
```

### Update User
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com",
    "role": "SALESPERSON"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

### Unauthorized
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Invalid credentials",
    "code": "AUTH_001",
    "details": null
  }
}
```

### Resource Not Found
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Product not found",
    "code": "PROD_001",
    "details": null
  }
}
```

### Insufficient Stock
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Insufficient stock for product: MacBook Pro",
    "code": "PROD_003",
    "details": null
  }
}
```

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "GrenGcry API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8081",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ]
}
```

## Testing Workflow

1. **Register** a new user
2. **Login** to get JWT token
3. **Save** the token for subsequent requests
4. **Create** admin user in database
5. **Login** as admin
6. **Create** products
7. **Create** orders as customer
8. **Update** order status as admin
9. **Submit** feedback
10. **View** analytics as admin
