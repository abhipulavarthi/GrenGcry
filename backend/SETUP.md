# Quick Setup Guide

## Prerequisites Checklist

- [ ] Java 17+ installed (`java -version`)
- [ ] Maven 3.6+ installed (`mvn -version`)
- [ ] PostgreSQL or MySQL installed and running
- [ ] Database created

## Step-by-Step Setup

### 1. Database Setup

#### PostgreSQL
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE grengcry;

-- Create user (optional)
CREATE USER grengcry_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE grengcry TO grengcry_user;
```

#### MySQL
```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE grengcry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'grengcry_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON grengcry.* TO 'grengcry_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Update these values
spring.datasource.url=jdbc:postgresql://localhost:5432/grengcry
spring.datasource.username=your_username
spring.datasource.password=your_password

# Change JWT secret (IMPORTANT for production!)
jwt.secret=ChangeThisToASecure256BitSecretKeyForProduction
```

### 3. Build and Run

```bash
# Navigate to backend directory
cd backend

# Clean and build
mvn clean install

# Run the application
mvn spring-boot:run
```

### 4. Verify Installation

Open browser or use curl:
```bash
curl http://localhost:8080/api/products
```

You should see:
```json
{
  "success": true,
  "data": {
    "data": [],
    "total": 0,
    "page": 1,
    "pages": 0
  },
  "error": null
}
```

### 5. Create Admin User

Use the register endpoint to create your first admin user:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@grengcry.com",
    "password": "Admin@123"
  }'
```

**Note**: You'll need to manually update the user role to ADMIN in the database:

```sql
-- PostgreSQL/MySQL
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@grengcry.com';
```

### 6. Test the API

1. **Login as Admin**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@grengcry.com",
    "password": "Admin@123"
  }'
```

2. **Create a Product** (use the token from login response)
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Sample Product" \
  -F "description=This is a sample product" \
  -F "category=Electronics" \
  -F "price=99.99" \
  -F "stock=100"
```

## Troubleshooting

### Port 8080 Already in Use
Edit `application.properties`:
```properties
server.port=8081
```

### Database Connection Error
- Verify database is running
- Check connection URL, username, and password
- Ensure database exists

### JWT Token Error
- Ensure JWT secret is at least 256 bits (32 characters)
- Check token format in Authorization header: `Bearer <token>`

### File Upload Error
- Create uploads directory: `mkdir uploads`
- Check file size (max 5MB)
- Verify file type (jpg, jpeg, png, webp only)

## Development Mode

Run with development profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

This uses `application-dev.properties` with auto-reset database schema.

## Production Deployment

1. Update `application-prod.properties` with environment variables
2. Build production JAR:
```bash
mvn clean package -DskipTests
```

3. Run with production profile:
```bash
java -jar target/grengcry-backend-1.0.0.jar --spring.profiles.active=prod
```

## Next Steps

- [ ] Configure email settings in `application.properties`
- [ ] Set up CORS for your frontend URL
- [ ] Implement rate limiting (optional)
- [ ] Set up logging
- [ ] Configure monitoring
- [ ] Deploy to production server

## Useful Commands

```bash
# Check if application is running
curl http://localhost:8080/actuator/health

# View logs
tail -f logs/spring.log

# Stop application
Ctrl + C

# Clean Maven cache
mvn clean

# Update dependencies
mvn dependency:resolve
```

## Support

For issues, check:
1. Application logs in console
2. Database logs
3. README.md for detailed documentation
