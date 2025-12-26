/**
 * @fileoverview Shopping Cart API Routes
 * 
 * This module defines REST API endpoints for shopping cart management.
 * Carts are stored in-memory and keyed by user ID.
 * 
 * @module routes/cart
 * 
 * @description
 * Endpoints:
 * - GET    /api/cart/:userId              - Get user's cart
 * - POST   /api/cart/:userId/items        - Add item to cart
 * - PUT    /api/cart/:userId/items/:isbn  - Update item quantity
 * - DELETE /api/cart/:userId/items/:isbn  - Remove item from cart
 * - DELETE /api/cart/:userId              - Clear entire cart
 * 
 * Cart Structure:
 * {
 *   items: [{ book: {...}, quantity: number }],
 *   totalItems: number,  // Sum of all quantities
 *   totalPrice: number   // Sum of (price * quantity)
 * }
 * 
 * @requires express
 */

const express = require('express');
const router = express.Router();

// ============================================
// MOCK DATA STORE
// ============================================

/**
 * In-memory cart storage using JavaScript Map.
 * Key: userId (string), Value: cart object
 * 
 * In production, this would use Redis or a database for persistence.
 * 
 * @type {Map<string, Object>}
 */
let carts = new Map();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Recalculates cart totals after any modification.
 * Updates totalItems (sum of quantities) and totalPrice.
 * 
 * @param {Object} cart - The cart object to update
 */
function recalculateTotals(cart) {
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.book.sellingPrice * item.quantity), 0);
}

// ============================================
// CART ENDPOINTS
// ============================================

/**
 * Get cart for a specific user.
 * Returns empty cart structure if user has no cart.
 * 
 * @route GET /api/cart/:userId
 * @param {string} req.params.userId - User's ID
 * @returns {Object} Cart object with items, totalItems, and totalPrice
 */
router.get('/:userId', (req, res) => {
  // Return existing cart or empty cart structure
  const cart = carts.get(req.params.userId) || { items: [], totalItems: 0, totalPrice: 0 };
  res.json(cart);
});

/**
 * Add an item to user's cart.
 * If item already exists, increases quantity.
 * 
 * @route POST /api/cart/:userId/items
 * @param {string} req.params.userId - User's ID
 * @param {Object} req.body.book - Complete book object to add
 * @param {number} [req.body.quantity=1] - Quantity to add (defaults to 1)
 * @returns {Object} Updated cart object
 */
router.post('/:userId/items', (req, res) => {
  const { userId } = req.params;
  const { book, quantity = 1 } = req.body;
  
  // Get existing cart or create new one
  let cart = carts.get(userId) || { items: [], totalItems: 0, totalPrice: 0 };
  
  // Check if book already exists in cart
  const existingItem = cart.items.find(item => item.book.isbn === book.isbn);
  
  if (existingItem) {
    // Increase quantity of existing item
    existingItem.quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({ book, quantity });
  }
  
  // Recalculate totals after modification
  recalculateTotals(cart);
  
  // Save updated cart
  carts.set(userId, cart);
  res.json(cart);
});

/**
 * Update quantity of a specific item in cart.
 * 
 * @route PUT /api/cart/:userId/items/:isbn
 * @param {string} req.params.userId - User's ID
 * @param {string} req.params.isbn - Book ISBN to update
 * @param {number} req.body.quantity - New quantity value
 * @returns {Object} Updated cart object
 * @returns {Object} Error with 404 if cart or item not found
 */
router.put('/:userId/items/:isbn', (req, res) => {
  const { userId, isbn } = req.params;
  const { quantity } = req.body;
  
  const cart = carts.get(userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  // Find the item to update
  const item = cart.items.find(item => item.book.isbn === isbn);
  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }
  
  // Update quantity
  item.quantity = quantity;
  
  // Recalculate totals
  recalculateTotals(cart);
  
  res.json(cart);
});

/**
 * Remove a specific item from cart.
 * 
 * @route DELETE /api/cart/:userId/items/:isbn
 * @param {string} req.params.userId - User's ID
 * @param {string} req.params.isbn - Book ISBN to remove
 * @returns {Object} Updated cart object
 * @returns {Object} Error with 404 if cart not found
 */
router.delete('/:userId/items/:isbn', (req, res) => {
  const { userId, isbn } = req.params;
  
  const cart = carts.get(userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  // Filter out the item to remove
  cart.items = cart.items.filter(item => item.book.isbn !== isbn);
  
  // Recalculate totals
  recalculateTotals(cart);
  
  res.json(cart);
});

/**
 * Clear entire cart for a user.
 * Removes the cart from storage entirely.
 * 
 * @route DELETE /api/cart/:userId
 * @param {string} req.params.userId - User's ID
 * @returns {void} 204 No Content on success
 */
router.delete('/:userId', (req, res) => {
  carts.delete(req.params.userId);
  res.status(204).send();
});

module.exports = router;
