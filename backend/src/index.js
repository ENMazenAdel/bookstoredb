/**
 * @fileoverview Express Server Entry Point
 * 
 * This is the main entry point for the Bookstore REST API server.
 * It configures Express with middleware and mounts all route handlers.
 * 
 * @module backend/index
 * 
 * @description
 * Server Configuration:
 * - Express.js as the web framework
 * - CORS enabled for cross-origin requests (frontend access)
 * - JSON body parsing for request payloads
 * - Environment variables via dotenv
 * 
 * API Routes:
 * - /api/books   - Book inventory CRUD operations
 * - /api/users   - User authentication and profile management
 * - /api/orders  - Order creation and management
 * - /api/cart    - Shopping cart operations
 * - /api/health  - Server health check endpoint
 * 
 * @requires express - Web application framework
 * @requires cors - Cross-Origin Resource Sharing middleware
 * @requires dotenv - Environment variable loader
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Express application
const app = express();

// Server port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

/**
 * Enable CORS for all routes.
 * Allows the frontend (running on different port) to access the API.
 */
app.use(cors());

/**
 * Parse JSON request bodies.
 * Enables req.body to contain parsed JSON data.
 */
app.use(express.json());

// ============================================
// ROUTE IMPORTS
// ============================================

/** Books router - handles /api/books/* endpoints */
const booksRouter = require('./routes/books');

/** Users router - handles /api/users/* endpoints */
const usersRouter = require('./routes/users');

/** Orders router - handles /api/orders/* endpoints */
const ordersRouter = require('./routes/orders');

/** Cart router - handles /api/cart/* endpoints */
const cartRouter = require('./routes/cart');

// ============================================
// ROUTE MOUNTING
// ============================================

/** Mount books routes at /api/books */
app.use('/api/books', booksRouter);

/** Mount users routes at /api/users */
app.use('/api/users', usersRouter);

/** Mount orders routes at /api/orders */
app.use('/api/orders', ordersRouter);

/** Mount cart routes at /api/cart */
app.use('/api/cart', cartRouter);

// ============================================
// UTILITY ENDPOINTS
// ============================================

/**
 * Health check endpoint.
 * Used to verify the server is running and responsive.
 * 
 * @route GET /api/health
 * @returns {Object} Status object with 'OK' status and message
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bookstore API is running' });
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Global error handling middleware.
 * Catches any unhandled errors and returns a 500 response.
 * 
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Next middleware function
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ============================================
// SERVER STARTUP
// ============================================

/**
 * Start the Express server.
 * Listens on the configured port and logs the server URL.
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
