# JWT Authentication System Guide

## 📚 What You Built

A complete JWT (JSON Web Token) authentication system with:
- **Register** - Create new user with hashed password
- **Login** - Authenticate user and get JWT token
- **Logout** - Clear user session
- **Protected Routes** - Access control using JWT tokens

---

## 🔐 How It Works

### 1. **Registration Process**
```
User sends:        { name, email, password }
                          ↓
System hashes password:   "password123" → "hashed_string_akj23h4k5j6h"
                          ↓
Saves to database:        { name, email, hashed_password }
                          ↓
Returns JWT token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. **Login Process**
```
User sends:        { email, password }
                          ↓
Find user in DB:          SELECT * FROM users WHERE email = ?
                          ↓
Compare passwords:        bcrypt.compare(password, hashed_password)
                          ↓
Generate token:           JWT with user ID
                          ↓
Return token:             User can access protected routes
```

### 3. **Protected Routes**
```
User sends request with:  Authorization: Bearer TOKEN
                          ↓
Middleware checks:        Is token valid?
                          ↓
If valid:                 Allow access + attach user data
If invalid:               Return 401 Unauthorized
```

---

## 🗄️ Database Update Required

Run this SQL in your PostgreSQL database to add password field:

```sql
-- Drop existing table and recreate with password field
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 API Endpoints

### 1. **Register New User**
```http
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "created_at": "2025-12-07T10:30:00.000Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

---

### 2. **Login User**
```http
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
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
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

---

### 3. **Get Current User (Protected)**
```http
GET http://localhost:5001/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2025-12-07T10:30:00.000Z"
    }
}
```

---

### 4. **Logout (Protected)**
```http
POST http://localhost:5001/api/auth/logout
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
    "success": true,
    "message": "Logged out successfully",
    "data": {}
}
```

---

## 🔑 Key Concepts Explained

### **1. Password Hashing (bcrypt)**
- **Why?** Never store plain text passwords!
- **How?** `bcrypt` converts "password123" → "random_hash_string"
- **Secure?** Even if database is hacked, passwords are safe

```javascript
// Hashing
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash("password123", salt);
// Result: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

// Comparing
const isMatch = await bcrypt.compare("password123", hashed);
// Returns: true or false
```

---

### **2. JWT Token**
- **What?** A secure token containing user info
- **Structure:** `header.payload.signature`
- **Contains:** User ID, expiration time
- **Valid:** 7 days (configurable in .env)

```javascript
// Generate token
const token = jwt.sign(
    { id: userId },           // Payload (user data)
    process.env.JWT_SECRET,   // Secret key
    { expiresIn: '7d' }       // Expires in 7 days
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Returns: { id: 1, iat: 1234567890, exp: 1234567890 }
```

---

### **3. Middleware Protection**
- **Purpose:** Block unauthorized users
- **How:** Check token before allowing access
- **Location:** Between route and controller

```javascript
// Protected route
router.get('/me', protect, getMe);
              //   ↑ This middleware runs first
```

---

## 📁 File Structure

```
server/
├── config/
│   └── db.js                    # Database connection
├── controller/
│   └── authController.js        # Register, Login, Logout handlers
├── models/
│   └── authModel.js            # Database queries + Password hashing
├── middlewires/
│   └── authMiddleware.js       # Token verification
├── routes/
│   └── authRoutes.js           # Auth endpoints
├── .env                         # JWT_SECRET, JWT_EXPIRE
└── index.js                     # Main server file
```

---

## 🔄 Authentication Flow Diagram

```
┌─────────────┐
│   CLIENT    │
└──────┬──────┘
       │ 1. Register/Login
       │    { email, password }
       ↓
┌─────────────────┐
│   CONTROLLER    │
│  (Validation)   │
└──────┬──────────┘
       │ 2. Check & Hash Password
       ↓
┌─────────────────┐
│     MODEL       │
│ (bcrypt, JWT)   │
└──────┬──────────┘
       │ 3. Save to DB
       ↓
┌─────────────────┐
│   DATABASE      │
│ (PostgreSQL)    │
└──────┬──────────┘
       │ 4. Return User + Token
       ↓
┌─────────────────┐
│   CLIENT        │
│  (Store Token)  │
└─────────────────┘
```

---

## 🧪 Testing with Postman/Thunder Client

### Step 1: Register
```
POST http://localhost:5001/api/auth/register
Body: { "name": "Test", "email": "test@test.com", "password": "123456" }
```
Copy the `token` from response.

### Step 2: Login
```
POST http://localhost:5001/api/auth/login
Body: { "email": "test@test.com", "password": "123456" }
```
Copy the `token` from response.

### Step 3: Access Protected Route
```
GET http://localhost:5001/api/auth/me
Headers: Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🛡️ Security Features

1. **Password Hashing** - bcrypt with salt rounds
2. **JWT Secret** - Environment variable (never commit to git!)
3. **Token Expiration** - Tokens expire after 7 days
4. **Email Validation** - Regex pattern check
5. **Password Length** - Minimum 6 characters
6. **Duplicate Email Check** - Prevents multiple accounts

---

## ⚙️ Environment Variables

```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Important:** Change `JWT_SECRET` to a random string in production!

---

## 🔍 How to Protect Your Routes

Add `protect` middleware to any route:

```javascript
import { protect } from '../middlewires/authMiddleware.js';

// Protected route - requires login
router.get('/user', protect, getAllusers);
router.put('/user/:id', protect, updateUser);
router.delete('/user/:id', protect, deleteUser);
```

---

## ❌ Common Errors & Solutions

### Error: "User already exists"
- **Cause:** Email already registered
- **Solution:** Use different email or login instead

### Error: "Invalid email or password"
- **Cause:** Wrong credentials
- **Solution:** Check email/password spelling

### Error: "Not authorized to access this route"
- **Cause:** No token or invalid token
- **Solution:** Include token in Authorization header

### Error: "Invalid or expired token"
- **Cause:** Token expired or tampered
- **Solution:** Login again to get new token

---

## 🎓 Learning Points

1. **Never store plain passwords** - Always hash them
2. **JWT is stateless** - Server doesn't store sessions
3. **Client stores token** - Usually in localStorage/cookies
4. **Middleware = Guard** - Checks before allowing access
5. **Token = Key** - Proves you are logged in

---

## 🚀 Next Steps

1. Update your database schema (add password field)
2. Test registration endpoint
3. Test login endpoint
4. Test protected routes with token
5. Add more protected routes to your app

---

## 📝 Summary

**What happens when you login:**
1. Server checks email & password
2. If correct, creates JWT token with your user ID
3. Returns token to you
4. You send token with every request
5. Server verifies token and allows access

**Token = Your Digital ID Card** 🎫
