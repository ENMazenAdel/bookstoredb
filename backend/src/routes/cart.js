const express = require('express');
const router = express.Router();

// Mock carts data (in-memory, keyed by user ID)
let carts = new Map();

// GET cart by user ID
router.get('/:userId', (req, res) => {
  const cart = carts.get(req.params.userId) || { items: [], totalItems: 0, totalPrice: 0 };
  res.json(cart);
});

// POST add item to cart
router.post('/:userId/items', (req, res) => {
  const { userId } = req.params;
  const { book, quantity = 1 } = req.body;
  
  let cart = carts.get(userId) || { items: [], totalItems: 0, totalPrice: 0 };
  
  const existingItem = cart.items.find(item => item.book.isbn === book.isbn);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ book, quantity });
  }
  
  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.book.sellingPrice * item.quantity), 0);
  
  carts.set(userId, cart);
  res.json(cart);
});

// PUT update item quantity
router.put('/:userId/items/:isbn', (req, res) => {
  const { userId, isbn } = req.params;
  const { quantity } = req.body;
  
  const cart = carts.get(userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  const item = cart.items.find(item => item.book.isbn === isbn);
  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }
  
  item.quantity = quantity;
  
  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.book.sellingPrice * item.quantity), 0);
  
  res.json(cart);
});

// DELETE remove item from cart
router.delete('/:userId/items/:isbn', (req, res) => {
  const { userId, isbn } = req.params;
  
  const cart = carts.get(userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  cart.items = cart.items.filter(item => item.book.isbn !== isbn);
  
  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.book.sellingPrice * item.quantity), 0);
  
  res.json(cart);
});

// DELETE clear cart
router.delete('/:userId', (req, res) => {
  carts.delete(req.params.userId);
  res.status(204).send();
});

module.exports = router;
