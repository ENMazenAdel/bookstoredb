/**
 * @fileoverview Users API Routes
 * 
 * This module defines REST API endpoints for user management including
 * authentication (login/register) and profile operations.
 * 
 * @module routes/users
 * 
 * @description
 * Endpoints:
 * - POST /api/users/login    - Authenticate user with credentials
 * - POST /api/users/register - Create new customer account
 * - GET  /api/users/:id      - Retrieve user profile by ID
 * - PUT  /api/users/:id      - Update user profile
 * 
 * Security Notes:
 * - Passwords are stored in plain text (demo only - use bcrypt in production)
 * - No JWT/session tokens (demo only - implement proper auth in production)
 * - Password is excluded from all API responses
 * 
 * @requires express
 */

const express = require('express');
const router = express.Router();

// ============================================
// MOCK DATA STORE
// ============================================

/**
 * In-memory users database.
 * In production, this would be replaced with a real database.
 * 
 * @type {Array<Object>}
 * @property {string} id - Unique user identifier
 * @property {string} username - Login username
 * @property {string} password - User password (plain text for demo)
 * @property {string} email - User email address
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} role - User role ('admin' or 'customer')
 * @property {string} [phone] - Optional phone number
 * @property {string} [shippingAddress] - Optional shipping address
 */
let users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',
    email: 'admin@bookstore.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    id: '2',
    username: 'john_doe',
    password: 'password',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    phone: '555-1234',
    shippingAddress: '123 Main St, City, ST 12345'
  }
];

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * User login endpoint.
 * Authenticates user with username and password.
 * 
 * @route POST /api/users/login
 * @param {Object} req.body - Login credentials
 * @param {string} req.body.username - User's username
 * @param {string} req.body.password - User's password
 * @returns {Object} User object (without password) on success
 * @returns {Object} Error object with 401 status on failure
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find user matching both username and password
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Exclude password from response using destructuring
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

/**
 * User registration endpoint.
 * Creates a new customer account.
 * 
 * @route POST /api/users/register
 * @param {Object} req.body - Registration data
 * @param {string} req.body.username - Desired username (must be unique)
 * @param {string} req.body.password - User's password
 * @param {string} req.body.email - User's email
 * @param {string} req.body.firstName - User's first name
 * @param {string} req.body.lastName - User's last name
 * @param {string} [req.body.phone] - Optional phone number
 * @param {string} [req.body.shippingAddress] - Optional shipping address
 * @returns {Object} Created user object (without password) with 201 status
 * @returns {Object} Error object with 400 status if username exists
 */
router.post('/register', (req, res) => {
  const { username, email } = req.body;
  
  // Check for duplicate username
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  // Create new user with auto-generated ID and customer role
  const newUser = {
    id: String(users.length + 1),
    ...req.body,
    role: 'customer'  // All new registrations are customers
  };
  
  users.push(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// ============================================
// PROFILE ENDPOINTS
// ============================================

/**
 * Get user profile by ID.
 * 
 * @route GET /api/users/:id
 * @param {string} req.params.id - User ID
 * @returns {Object} User object (without password)
 * @returns {Object} Error object with 404 status if not found
 */
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Exclude password from response
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

/**
 * Update user profile.
 * Allows partial updates - only provided fields are updated.
 * 
 * @route PUT /api/users/:id
 * @param {string} req.params.id - User ID
 * @param {Object} req.body - Fields to update
 * @returns {Object} Updated user object (without password)
 * @returns {Object} Error object with 404 status if not found
 */
router.put('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Merge existing user with updates (spread operator)
  users[index] = { ...users[index], ...req.body };
  
  // Return updated user without password
  const { password: _, ...userWithoutPassword } = users[index];
  res.json(userWithoutPassword);
});

module.exports = router;
