# GrenGcry Backend - Spring Boot E-Commerce API

A comprehensive e-commerce backend built with Spring Boot 3.1, featuring JWT authentication, role-based access control, and RESTful APIs for managing products, orders, users, and feedback.

## Technology Stack

- **Spring Boot 3.1.5** - Core framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database operations
- **JWT (JSON Web Tokens)** - Secure authentication
- **PostgreSQL/MySQL** - Database
- **Maven** - Build & dependency management
- **Lombok** - Code simplification

## Features

- ✅ JWT-based authentication with 24-hour token expiration
- ✅ Role-based access control (CUSTOMER, ADMIN, SALESPERSON)
- ✅ Complete CRUD operations for Users, Products, Orders, and Feedback
- ✅ Product search and filtering
- ✅ Order management with status tracking
- ✅ File upload for product images (5MB limit)
- ✅ Pagination for all list endpoints
- ✅ Global exception handling
- ✅ Input validation
- ✅ CORS configuration
- ✅ Database indexing for performance

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+ or MySQL 8+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Getting Started

### 1. Clone the Repository

```bash
cd backend
```

### 2. Configure Database

#### For PostgreSQL:
```sql
CREATE DATABASE grengcry;
```

#### For MySQL:
```sql
CREATE DATABASE grengcry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Update Application Properties

Edit `src/main/resources/application.properties`:

```properties
# For PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/grengcry
spring.datasource.username=your_username
spring.datasource.password=your_password

# For MySQL (uncomment and use instead)
# spring.datasource.url=jdbc:mysql://localhost:3306/grengcry
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# JWT Secret (Change in production!)
jwt.secret=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLong
```

### 4. Build the Project

```bash
mvn clean install
```

### 5. Run the Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Users (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Yes (Admin) |
| GET | `/api/users/{id}` | Get user by ID | Yes (Admin) |
| PUT | `/api/users/{id}` | Update user | Yes (Admin) |
| DELETE | `/api/users/{id}` | Delete user | Yes (Admin) |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/{id}` | Get product by ID | No |
| POST | `/api/products` | Create product | Yes (Admin) |
| PUT | `/api/products/{id}` | Update product | Yes (Admin) |
| DELETE | `/api/products/{id}` | Delete product | Yes (Admin) |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | Get orders | Yes |
| GET | `/api/orders/{id}` | Get order by ID | Yes |
| POST | `/api/orders` | Create order | Yes |
| PUT | `/api/orders/{id}` | Update order status | Yes (Admin/Salesperson) |

### Feedback

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/feedback` | Get all feedback | Yes (Admin) |
| POST | `/api/feedback` | Create feedback | Yes |
| DELETE | `/api/feedback/{id}` | Delete feedback | Yes (Admin) |

## Request Examples

### Register User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Product (Admin)

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Product Name" \
  -F "description=Product Description" \
  -F "category=Electronics" \
  -F "price=99.99" \
  -F "stock=50" \
  -F "image=@product.jpg"
```

### Create Order

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'
```

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Token expired |
| AUTH_003 | Invalid token |
| AUTH_004 | Insufficient permissions |
| USER_001 | User not found |
| USER_002 | Email already exists |
| PROD_001 | Product not found |
| PROD_002 | Invalid product data |
| PROD_003 | Insufficient stock |
| ORD_001 | Order not found |
| ORD_002 | Invalid order data |
| FEED_001 | Feedback not found |

## Security Features

- **Password Encryption**: BCrypt with 10 salt rounds
- **JWT Authentication**: 24-hour token expiration
- **Role-Based Access Control**: CUSTOMER, ADMIN, SALESPERSON
- **CORS Configuration**: Configured for localhost development
- **Input Validation**: Bean Validation (JSR-303)
- **Rate Limiting**: Ready for implementation
- **File Upload Limits**: 5MB maximum file size

## Database Schema

The application automatically creates the following tables:

- `users` - User accounts and authentication
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items
- `feedback` - Customer feedback and ratings

Indexes are automatically created on frequently queried fields for optimal performance.

## Development

### Running Tests

```bash
mvn test
```

### Building for Production

```bash
mvn clean package -DskipTests
```

The JAR file will be created in `target/grengcry-backend-1.0.0.jar`

### Running in Production

```bash
java -jar target/grengcry-backend-1.0.0.jar --spring.profiles.active=prod
```

## Environment Variables (Production)

Set these environment variables in production:

```bash
DATABASE_URL=jdbc:postgresql://your-db-host:5432/grengcry
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
JWT_SECRET=your_production_secret_key
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/grengcry/
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Exception handling
│   │   │   ├── model/           # Entity classes
│   │   │   ├── repository/      # Data access layer
│   │   │   ├── security/        # Security configuration
│   │   │   ├── service/         # Business logic
│   │   │   ├── util/            # Utility classes
│   │   │   └── GrenGcryApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                    # Test files
├── uploads/                     # Product images
├── pom.xml                      # Maven configuration
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Spring Boot**
