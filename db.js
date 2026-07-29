/**
 * db.js
 * 
 * This module manages the connection pool to the PostgreSQL database
 * using the 'pg' library. A connection pool reuses database connections
 * efficiently instead of opening and closing a connection for every query.
 */

const { Pool } = require('pg');
require('dotenv').config();

// Configuration using environment variables with sensible defaults
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      ...(process.env.DB_PASSWORD !== undefined && { password: String(process.env.DB_PASSWORD) }),
      database: process.env.DB_NAME || 'cicd_demo_db',
    };

// Initialize the PostgreSQL connection pool
const pool = new Pool(poolConfig);

// Event listener for unexpected errors on idle database clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

// Helper function to test database connectivity
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log(' Successfully connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error(` Database connection failed: ${error.message}`);
    if (!process.env.DB_PASSWORD && !process.env.DATABASE_URL) {
      console.warn('⚠️  No .env file found or DB_PASSWORD is not set. Create a .env file with your PostgreSQL credentials.');
    }
  }
};

// Test connection on module load
testConnection();

module.exports = {
  // Export pool object to execute parameterized queries: pool.query(text, params)
  query: (text, params) => pool.query(text, params),
  pool,
};
