# 🛒 Multi-Vendor eCommerce Authentication System

A robust Node.js backend API for a multi-vendor eCommerce platform with role-based authentication, JWT tokens, and comprehensive product management.

## 🚀 Features

- **Multi-Role Authentication**: Admin, Vendor, and Customer roles
- **JWT Token System**: Access and refresh token implementation
- **Product Management**: Full CRUD operations for vendors
- **Role-Based Access Control**: Protected routes based on user roles
- **API Testing Dashboard**: Built-in web interface for testing APIs
- **MongoDB Integration**: Mongoose ODM for data modeling
- **Security Features**: Rate limiting, input validation, password hashing

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, express-rate-limit, express-validator
- **Frontend**: HTML, CSS, JavaScript (API Dashboard)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:prasadkambale181-cmd/Authentication-System.git
   cd Authentication-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_access_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. **Setup Database**
   ```bash
   npm run setup-db
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

## 🎯 Quick Start

1. Run `npm run setup-db` to create test users and sample products
2. Start the server with `npm run dev`
3. Open `http://localhost:5000` in your browser
4. Click "Open API Dashboard" to test the APIs

### Test Accounts
- **Admin**: admin@ecommerce.com / admin123
- **Vendor**: vendor@ecommerce.com / vendor123
- **Customer**: customer@ecommerce.com / customer123

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    }
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

### Logout
```http
POST /auth/logout
```

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

---

## 👑 Admin Endpoints

### Get All Users
```http
GET /admin/users
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 🏪 Vendor Endpoints

### Get Vendor Products
```http
GET /vendor/products
Authorization: Bearer {access_token}
```

### Add Product
```http
POST /vendor/products
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added successfully",
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 10,
    "vendor": "vendor_id",
    "status": "active"
  }
}
```

### Update Product
```http
PUT /vendor/products/{product_id}
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 149.99,
  "stock": 15
}
```

### Delete Product
```http
DELETE /vendor/products/{product_id}
Authorization: Bearer {access_token}
```

---

## 🛍️ Customer Endpoints

### Get All Products
```http
GET /customer/products
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "category": "Electronics",
      "stock": 10,
      "vendor": {
        "firstName": "Vendor",
        "lastName": "Name"
      },
      "status": "active"
    }
  ]
}
```

### Get Product Details
```http
GET /customer/products/{product_id}
Authorization: Bearer {access_token}
```

---

## ❤️ Health Check

### Server Health
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## 🔒 Authentication

Most endpoints require authentication. Include the access token in the Authorization header:

```http
Authorization: Bearer your_access_token_here
```

### Token Lifecycle
- **Access Token**: Expires in 15 minutes
- **Refresh Token**: Expires in 7 days
- Use refresh token to get new access tokens

---

## 🎭 User Roles

### Admin
- View all users in the system
- System administration capabilities

### Vendor
- Manage their own products (CRUD operations)
- View their product inventory

### Customer
- Browse all active products
- View detailed product information

---

## 🧪 Testing with API Dashboard

1. Open `http://localhost:5000/dashboard.html`
2. Select an endpoint from the sidebar
3. Sample request data will auto-populate
4. For authentication:
   - First login to get access token
   - Token is automatically saved and used for protected endpoints
5. View formatted responses with status codes

---

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Setup database with test users and sample products
npm run setup-db

# Create admin user only
npm run create-admin

# Add sample products only
npm run add-sample-products
```

---

## 🔧 Project Structure

```
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model
│   └── Product.js           # Product model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── admin.js             # Admin routes
│   ├── vendor.js            # Vendor routes
│   └── customer.js          # Customer routes
├── scripts/
│   ├── createAdmin.js       # Create admin user
│   ├── addSampleProducts.js # Add sample products
│   └── setupDatabase.js     # Complete database setup
├── utils/
│   └── tokenUtils.js        # JWT utility functions
├── public/
│   ├── index.html           # Landing page
│   └── dashboard.html       # API testing dashboard
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json             # Dependencies and scripts
```

---

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure access and refresh token system
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: express-validator for request validation
- **CORS**: Configured for secure cross-origin requests
- **Role-Based Access**: Protected routes based on user roles

---

## 🚀 Deployment

1. Set production environment variables
2. Update CORS origins for your domain
3. Use a production MongoDB instance
4. Set NODE_ENV=production
5. Use PM2 or similar for process management

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Prasad Kambale**
- GitHub: [@prasadkambale181-cmd](https://github.com/prasadkambale181-cmd)

---

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Coding! 🎉**