# CalmApp API

A lightweight Node.js REST API service built with Express.js and Knex.js query builder for SQL Server database.

## 🚀 Features

- **Modern Architecture**: Clean separation of concerns (Routes → Controllers → Services → Models)
- **Knex.js Query Builder**: Lightweight alternative to ORMs with SQL control
- **SQL Server Support**: Optimized for Microsoft SQL Server
- **Input Validation**: Express-validator for request validation
- **Error Handling**: Comprehensive error handling with consistent responses
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Morgan for request logging
- **Environment Config**: Dotenv for configuration management

## 📁 Project Structure

```
calmapp/
├── src/
│   ├── config/
│   │   ├── database.js          # Knex database configuration
│   │   └── app.js              # Express app configuration
│   ├── routes/
│   │   ├── index.js            # Main router
│   │   └── api/                # API route modules
│   ├── controllers/            # Request handlers
│   ├── services/              # Business logic layer
│   ├── models/                # Database queries (Knex)
│   ├── middleware/            # Custom middleware
│   └── utils/                 # Utility functions
├── package.json
├── knexfile.js                # Knex configuration
├── server.js                  # Application entry point
└── env.example               # Environment variables template
```

## 🛠️ Installation

### Prerequisites
- Node.js 16+ 
- SQL Server (local or remote)
- npm or yarn

### Setup Steps

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Environment Configuration:**
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your database credentials
```

3. **Configure your database connection in `.env`:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# SQL Server Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_INSTANCE=SQLEXPRESS

# Optional: For Windows Authentication
DB_TRUSTED_CONNECTION=false
```

4. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 🗄️ Database Setup

### Providing Your Database Schema

You can provide your database schema in several ways:

#### Option 1: SQL Schema File
Create a file `schema.sql` and paste your CREATE TABLE statements:

```sql
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    firstName NVARCHAR(50) NOT NULL,
    lastName NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    age INT,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoryId INT,
    isActive BIT DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
```

#### Option 2: JSON Schema Description
Describe your tables in a `database-schema.json` file:

```json
{
  "tables": {
    "users": {
      "columns": {
        "id": "INT IDENTITY(1,1) PRIMARY KEY",
        "firstName": "NVARCHAR(50) NOT NULL",
        "lastName": "NVARCHAR(50) NOT NULL", 
        "email": "NVARCHAR(100) UNIQUE NOT NULL"
      }
    },
    "products": {
      "columns": {
        "id": "INT IDENTITY(1,1) PRIMARY KEY",
        "name": "NVARCHAR(100) NOT NULL",
        "price": "DECIMAL(10,2) NOT NULL"
      }
    }
  }
}
```

#### Option 3: Existing Database
If you have an existing database, just provide:
- Connection details in `.env`
- Table names you want to work with
- Any specific relationships or complex queries you need

### Knex Migrations (Optional)

Create database migrations for version control:

```bash
# Create a new migration
npm run migrate:make create_users_table

# Run migrations
npm run migrate

# Rollback migrations
npm run migrate:rollback
```

## 📚 API Endpoints

### Base URL: `http://localhost:3000/api/v1`

#### 📖 API Documentation
- `GET /api/docs` - **Interactive Swagger UI Documentation**
- `GET /api/v1/docs` - Alternative Swagger UI endpoint
- `GET /api/docs.json` - OpenAPI JSON specification
- `GET /api/v1` - API information and available endpoints

#### 🏥 Health Check
- `GET /health` - Server health status

#### 📋 Work Order Endpoints
- `GET /api/v1/workorders` - Get all work orders (with filtering & pagination)
- `GET /api/v1/workorders/:id` - Get specific work order
- `GET /api/v1/workorders/:id/comments` - Get work order comments
- `GET /api/v1/workorders/:id/status-log` - Get work order status history

#### 📊 Statistics Endpoints
- `GET /api/v1/workorders/stats/summary` - Overall statistics
- `GET /api/v1/workorders/stats/by-status` - Count by status
- `GET /api/v1/workorders/stats/by-priority` - Count by priority
- `GET /api/v1/workorders/stats/by-division` - Count by division

## 🔧 Usage Examples

### Starting the Server
```bash
npm run dev
```

### 📖 Interactive API Documentation
Once the server is running, visit these URLs in your browser:

- **Primary Documentation**: http://localhost:3000/api/docs
- **Alternative URL**: http://localhost:3000/api/v1/docs

The Swagger UI provides:
- ✅ **Interactive testing** - Try all endpoints directly from the browser
- ✅ **Complete parameter documentation** - All query parameters, filters, and examples
- ✅ **Response schemas** - Detailed response structures
- ✅ **Error handling examples** - Error response formats
- ✅ **Request/Response examples** - Sample data for testing

### Test the API
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test API info
curl http://localhost:3000/api/v1

# Test work orders with filters
curl "http://localhost:3000/api/v1/workorders?page=1&limit=5&search=Fluke"

# Test work order statistics
curl http://localhost:3000/api/v1/workorders/stats/summary
```

## 🏗️ Creating Your Own Modules

The project structure is ready for you to create your own modules:

1. **Routes**: Add new route files in `src/routes/api/`
2. **Controllers**: Create controllers in `src/controllers/`
3. **Services**: Add business logic in `src/services/`
4. **Models**: Create database models in `src/models/`

### Example Module Creation
```javascript
// src/routes/api/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);

module.exports = router;
```

## 🚀 Next Steps

1. **Provide your database schema** using one of the methods above
2. **Create your custom modules** based on your business requirements  
3. **Configure environment variables** for your SQL Server
4. **Test the connection** by running the server

## 📋 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback migrations
- `npm run migrate:make <name>` - Create new migration

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting (100 requests per 15 minutes)
- **Input Validation**: Request validation with express-validator
- **SQL Injection Prevention**: Parameterized queries with Knex

## 📝 License

MIT License

---

**Ready to start building!** 🎉

Provide your database schema and start creating your custom modules. # clamapp-service-1
