/**
 * routes/password.js
 * 
 * Express router handling password management routes:
 * - POST /password     : Save a new password entry
 * - GET /passwords     : Retrieve all password entries
 * - DELETE /password/:id : Delete a password entry by ID
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /password
 * Accepts: { "password": "string" }
 * Inserts the password into PostgreSQL using a parameterized query to prevent SQL injection.
 * Returns: The newly created record with HTTP 201 Created.
 */
router.post('/password', async (req, res, next) => {
  try {
    const { password } = req.body;

    // Basic request body validation
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Field "password" is required and must be a non-empty string.',
      });
    }

    // Parameterized SQL query for safe insertion
    const queryText = `
      INSERT INTO passwords (password)
      VALUES ($1)
      RETURNING *;
    `;
    const values = [password];

    const result = await db.query(queryText, values);

    // Return the inserted row with 201 status code
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /passwords
 * Retrieves all stored passwords ordered by creation date descending.
 * Returns: JSON array of password objects with HTTP 200 OK.
 */
router.get('/passwords', async (req, res, next) => {
  try {
    const queryText = `
      SELECT id, password, created_at
      FROM passwords
      ORDER BY created_at DESC;
    `;

    const result = await db.query(queryText);

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /password/:id
 * Deletes a password record matching the specified ID parameter.
 * Returns: The deleted password object with HTTP 200 OK, or 404 Not Found if missing.
 */
router.delete('/password/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate that id is an integer
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid ID format. ID must be a valid integer.',
      });
    }

    // Parameterized SQL query for deletion
    const queryText = `
      DELETE FROM passwords
      WHERE id = $1
      RETURNING *;
    `;
    const values = [numericId];

    const result = await db.query(queryText, values);

    // Check if any row was deleted
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Password with ID ${numericId} does not exist.`,
      });
    }

    return res.status(200).json({
      message: 'Password deleted successfully',
      deleted: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
