import pool from '../config/db.js';

const createUsertable=async()=>{
    const queryText=
    `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)`;
try {
    await pool.query(queryText);
} catch (error) {
    console.error('Error creating users table:', error);
}
}