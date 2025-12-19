const express = require('express');
const router = express.Router();

// Mock data - In production, this would come from a database
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

// GET all books
router.get('/', (req, res) => {
  res.json(books);
});

// GET book by ISBN
router.get('/:isbn', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

// POST create new book
router.post('/', (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT update book
router.put('/:isbn', (req, res) => {
  const index = books.findIndex(b => b.isbn === req.params.isbn);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
});

// DELETE book
router.delete('/:isbn', (req, res) => {
  const index = books.findIndex(b => b.isbn === req.params.isbn);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  books.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
