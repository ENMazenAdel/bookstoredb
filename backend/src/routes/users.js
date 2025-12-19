const express = require('express');
const router = express.Router();

// Mock users data
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

// POST login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Don't send password back
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// POST register
router.post('/register', (req, res) => {
  const { username, email } = req.body;
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  const newUser = {
    id: String(users.length + 1),
    ...req.body,
    role: 'customer'
  };
  
  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// GET user profile
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// PUT update user
router.put('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users[index] = { ...users[index], ...req.body };
  const { password: _, ...userWithoutPassword } = users[index];
  res.json(userWithoutPassword);
});

module.exports = router;
