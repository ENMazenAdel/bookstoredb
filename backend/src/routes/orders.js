const express = require('express');
const router = express.Router();

// Mock orders data
let orders = [];

// GET all orders
router.get('/', (req, res) => {
  res.json(orders);
});

// GET orders by user ID
router.get('/user/:userId', (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.params.userId);
  res.json(userOrders);
});

// GET order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// POST create new order
router.post('/', (req, res) => {
  const newOrder = {
    id: `ORD-${Date.now()}`,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// PUT update order status
router.put('/:id', (req, res) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  orders[index] = { ...orders[index], ...req.body };
  res.json(orders[index]);
});

module.exports = router;
