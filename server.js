/**
 * server.js
 * 
 * Main entry point for the Express.js application.
 * Configures express middleware, routes, error handling, and server listening.
 */

const express = require('express');
require('dotenv').config();

const passwordRoutes = require('./routes/password');
const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 8000;

// Enable JSON request body parsing
//be  a good man with a good path
app.use(express.json());

app.get("/status", (req, res) => {
  res.json({
    status: "success",
    message: "CI/CD pipeline is working!",
    timestamp: new Date().toISOString()
  });
});/**
 * GET /
 * Root route returning welcome message.
 */
app.get('/', (req, res) => {
  res.status(200).send('Hi from CI/CD Demo 🚀');
});

/**
 * GET /health
 * Health check endpoint returning server status and uptime in seconds.
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: `${process.uptime().toFixed(2)} seconds`,
  });
});

// Mount Password Router
app.use('/', passwordRoutes);

/**
 * 404 Handler for undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

/**
 * Global Error Handling Middleware
 */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.',
  });
});

// Start listening on the specified PORT
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown handling for process termination
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await pool.end();
      console.log('PostgreSQL pool connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during pool shutdown:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
// Deploy Test
// Auto Deploy Test
