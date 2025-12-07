import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (name, email, password) => {
    // Check if user already exists
    const userExists = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (userExists.rows.length > 0) {
        throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [name, email, hashedPassword]
    );

    return result.rows[0];
};

// Login user
export const loginUser = async (email, password) => {
    // Find user by email
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// Generate JWT token
export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Get user by ID (for protected routes)
export const getUserById = async (userId) => {
    const result = await pool.query(
        'SELECT id, name, email, created_at FROM users WHERE id = $1',
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    return result.rows[0];
};
