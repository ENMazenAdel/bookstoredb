/**
 * @fileoverview Books API Routes
 * 
 * This module defines REST API endpoints for book inventory management.
 * Provides CRUD operations for the book catalog.
 * 
 * @module routes/books
 * 
 * @description
 * Endpoints:
 * - GET    /api/books      - Get all books in inventory
 * - GET    /api/books/:isbn - Get single book by ISBN
 * - POST   /api/books      - Add new book to inventory
 * - PUT    /api/books/:isbn - Update existing book
 * - DELETE /api/books/:isbn - Remove book from inventory
 * 
 * Book Schema:
 * {
 *   isbn: string,          // ISBN-13 identifier (primary key)
 *   title: string,         // Book title
 *   authors: string[],     // Array of author names
 *   publisher: string,     // Publisher name
 *   publicationYear: number,
 *   sellingPrice: number,  // Price in USD
 *   category: string,      // 'Science', 'Art', 'History', 'Religion', 'Geography'
 *   quantity: number,      // Current stock level
 *   threshold: number,     // Minimum stock before reorder
 *   imageUrl: string       // Book cover image URL
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
 * In-memory books database.
 * Contains sample book inventory data. In production, this would be
 * replaced with a PostgreSQL database connection.
 * 
 * Each book has:
 * - isbn: Unique ISBN-13 identifier
 * - title: Book title
 * - authors: Array of author names
 * - publisher: Publishing company name
 * - publicationYear: Year of publication
 * - sellingPrice: Retail price in USD
 * - category: Classification (Science, Art, History, Religion, Geography)
 * - quantity: Current copies in stock
 * - threshold: Minimum stock level (triggers auto-reorder when reached)
 * - imageUrl: Cover image URL
 * 
 * @type {Array<Object>}
 */
let books = [
  {
    isbn: '978-0-13-468599-1',
    title: 'The Art of Computer Programming',
    authors: ['Donald Knuth'],
    publisher: 'Addison-Wesley',
    publicationYear: 2011,
    sellingPrice: 89.99,
    category: 'Science',
    quantity: 25,
    threshold: 5,
    imageUrl: 'https://m.media-amazon.com/images/I/41T0PoMmhgL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg'
  },
  {
    isbn: '978-0-06-112008-4',
    title: 'To Kill a Mockingbird',
    authors: ['Harper Lee'],
    publisher: 'HarperCollins',
    publicationYear: 1960,
    sellingPrice: 14.99,
    category: 'Art',
    quantity: 50,
    threshold: 10,
    imageUrl: 'https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg'
  },
  {
    isbn: '978-0-19-953556-8',
    title: 'A History of Modern Europe',
    authors: ['John Merriman'],
    publisher: 'W.W. Norton',
    publicationYear: 2019,
    sellingPrice: 65.00,
    category: 'History',
    quantity: 15,
    threshold: 3,
    imageUrl: 'https://m.media-amazon.com/images/I/51Ga5GuElyL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    isbn: '978-0-07-352332-7',
    title: 'Physical Geography',
    authors: ['Alan Strahler', 'Arthur Strahler'],
    publisher: 'Wiley',
    publicationYear: 2013,
    sellingPrice: 120.00,
    category: 'Geography',
    quantity: 8,
    threshold: 5,
    imageUrl: 'https://m.media-amazon.com/images/I/51pSgz35YoL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    isbn: '978-0-06-093546-7',
    title: 'The Case for God',
    authors: ['Karen Armstrong'],
    publisher: 'Knopf',
    publicationYear: 2009,
    sellingPrice: 27.95,
    category: 'Religion',
    quantity: 30,
    threshold: 7,
    imageUrl: 'https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    isbn: '978-1-59448-273-9',
    title: 'A Short History of Nearly Everything',
    authors: ['Bill Bryson'],
    publisher: 'Broadway Books',
    publicationYear: 2004,
    sellingPrice: 18.00,
    category: 'Science',
    quantity: 40,
    threshold: 8,
    imageUrl: 'https://m.media-amazon.com/images/I/71zIgNAJqRL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    isbn: '978-0-14-028329-7',
    title: 'The Story of Art',
    authors: ['E.H. Gombrich'],
    publisher: 'Phaidon Press',
    publicationYear: 1950,
    sellingPrice: 39.95,
    category: 'Art',
    quantity: 22,
    threshold: 5,
    imageUrl: 'https://m.media-amazon.com/images/I/91H3BZfBB4L._AC_UF1000,1000_QL80_.jpg'
  },
  {
    isbn: '978-0-06-083865-2',
    title: 'Sapiens: A Brief History of Humankind',
    authors: ['Yuval Noah Harari'],
    publisher: 'Harper',
    publicationYear: 2015,
    sellingPrice: 24.99,
    category: 'History',
    quantity: 60,
    threshold: 12,
    imageUrl: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    isbn: '978-0-19-280722-2',
    title: 'World Religions',
    authors: ['John Bowker'],
    publisher: 'Oxford University Press',
    publicationYear: 2006,
    sellingPrice: 22.50,
    category: 'Religion',
    quantity: 18,
    threshold: 4,
    imageUrl: 'https://m.media-amazon.com/images/I/A1cRMQXC4WL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    isbn: '978-0-321-12521-7',
    title: 'Introduction to Algorithms',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest'],
    publisher: 'MIT Press',
    publicationYear: 2009,
    sellingPrice: 95.00,
    category: 'Science',
    quantity: 3,
    threshold: 5,
    imageUrl: 'https://m.media-amazon.com/images/I/61Pgdn8Ys-L._AC_UF1000,1000_QL80_.jpg'
  }
];

// ============================================
// BOOK ENDPOINTS
// ============================================

/**
 * Get all books in inventory.
 * Returns the complete list of books available in the store.
 * 
 * @route GET /api/books
 * @returns {Array<Object>} Array of all book objects
 * 
 * @example
 * // Response: [{ isbn: "978-...", title: "...", ... }, ...]
 */
router.get('/', (req, res) => {
  res.json(books);
});

/**
 * Get a single book by ISBN.
 * 
 * @route GET /api/books/:isbn
 * @param {string} req.params.isbn - Book's ISBN identifier
 * @returns {Object} Book object
 * @returns {Object} Error with 404 status if not found
 * 
 * @example
 * // GET /api/books/978-0-13-468599-1
 * // Response: { isbn: "978-0-13-468599-1", title: "The Art of...", ... }
 */
router.get('/:isbn', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  res.json(book);
});

/**
 * Add a new book to inventory.
 * Creates a new book entry with the provided data.
 * 
 * @route POST /api/books
 * @param {Object} req.body - Complete book object
 * @param {string} req.body.isbn - ISBN-13 identifier (required)
 * @param {string} req.body.title - Book title (required)
 * @param {string[]} req.body.authors - Array of author names
 * @param {string} req.body.publisher - Publisher name
 * @param {number} req.body.publicationYear - Year of publication
 * @param {number} req.body.sellingPrice - Price in USD
 * @param {string} req.body.category - Book category
 * @param {number} req.body.quantity - Initial stock quantity
 * @param {number} req.body.threshold - Minimum stock threshold
 * @returns {Object} Created book with 201 status
 */
router.post('/', (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  res.status(201).json(newBook);
});

/**
 * Update an existing book.
 * Allows partial updates - only provided fields are modified.
 * 
 * @route PUT /api/books/:isbn
 * @param {string} req.params.isbn - Book's ISBN identifier
 * @param {Object} req.body - Fields to update
 * @returns {Object} Updated book object
 * @returns {Object} Error with 404 status if not found
 */
router.put('/:isbn', (req, res) => {
  const index = books.findIndex(b => b.isbn === req.params.isbn);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  // Merge existing book with updates using spread operator
  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
});

/**
 * Delete a book from inventory.
 * Permanently removes the book from the database.
 * 
 * @route DELETE /api/books/:isbn
 * @param {string} req.params.isbn - Book's ISBN identifier
 * @returns {void} 204 No Content on success
 * @returns {Object} Error with 404 status if not found
 */
router.delete('/:isbn', (req, res) => {
  const index = books.findIndex(b => b.isbn === req.params.isbn);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  // Remove book from array
  books.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
