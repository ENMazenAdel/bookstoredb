/**
 * @fileoverview Orders API Routes
 * 
 * This module defines REST API endpoints for customer order management.
 * Handles order creation, retrieval, and status updates.
 * 
 * @module routes/orders
 * 
 * @description
 * Endpoints:
 * - GET  /api/orders           - Get all orders (admin use)
 * - GET  /api/orders/user/:id  - Get orders for specific user
 * - GET  /api/orders/:id       - Get single order by ID
 * - POST /api/orders           - Create new order
 * - PUT  /api/orders/:id       - Update order (e.g., status)
 * 
 * Order Lifecycle:
 * 1. pending   - Order created, awaiting processing
 * 2. shipped   - Order has been shipped
 * 3. delivered - Order delivered to customer
 * 4. cancelled - Order was cancelled
 * 
 * @requires express
 */

const express = require('express');
const router = express.Router();

// ============================================
// MOCK DATA STORE
// ============================================

/**
 * In-memory orders database.
 * Stores all customer orders. In production, use a real database.
 * 
 * @type {Array<Object>}
 */
let orders = [];

// ============================================
// ORDER ENDPOINTS
// ============================================

/**
 * Get all orders.
 * Typically used by admin to view all orders in the system.
 * 
 * @route GET /api/orders
 * @returns {Array<Object>} Array of all order objects
 */
router.get('/', (req, res) => {
  res.json(orders);
});

/**
 * Get all orders for a specific user.
 * Used to display order history for a customer.
 * 
 * @route GET /api/orders/user/:userId
 * @param {string} req.params.userId - User's ID
 * @returns {Array<Object>} Array of user's orders
 */
router.get('/user/:userId', (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.params.userId);
  res.json(userOrders);
});

/**
 * Get a single order by ID.
 * 
 * @route GET /api/orders/:id
 * @param {string} req.params.id - Order ID
 * @returns {Object} Order object
 * @returns {Object} Error with 404 if not found
 */
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);
});

/**
 * Create a new order.
 * Auto-generates ID and timestamps. Sets initial status to 'pending'.
 * 
 * @route POST /api/orders
 * @param {Object} req.body - Order data
 * @param {string} req.body.userId - Customer's user ID
 * @param {Array} req.body.items - Array of order items
 * @param {number} req.body.totalPrice - Total order amount
 * @returns {Object} Created order with 201 status
 */
router.post('/', (req, res) => {
  const newOrder = {
    id: `ORD-${Date.now()}`,  // Generate unique ID using timestamp
    ...req.body,
    status: 'pending',         // Initial status
    createdAt: new Date().toISOString()  // ISO timestamp
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

/**
 * Update an existing order.
 * Commonly used to update order status (e.g., to 'shipped' or 'delivered').
 * 
 * @route PUT /api/orders/:id
 * @param {string} req.params.id - Order ID
 * @param {Object} req.body - Fields to update
 * @returns {Object} Updated order object
 * @returns {Object} Error with 404 if not found
 */
router.put('/:id', (req, res) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  // Merge existing order with updates
  orders[index] = { ...orders[index], ...req.body };
  res.json(orders[index]);
});

module.exports = router;
