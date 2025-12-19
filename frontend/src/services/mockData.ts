import { Book, Publisher, PublisherOrder, User, CustomerOrder } from '../types';

export const mockBooks: Book[] = [
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
    imageUrl: 'https://placehold.co/400x600/4f46e5/ffffff?text=The+Art+of+Computer+Programming'
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
    imageUrl: 'https://placehold.co/400x600/e11d48/ffffff?text=To+Kill+a+Mockingbird'
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
    imageUrl: 'https://placehold.co/400x600/f59e0b/ffffff?text=A+History+of+Modern+Europe'
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
    imageUrl: 'https://placehold.co/400x600/10b981/ffffff?text=Physical+Geography'
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
    imageUrl: 'https://placehold.co/400x600/8b5cf6/ffffff?text=The+Case+for+God'
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
    imageUrl: 'https://placehold.co/400x600/4f46e5/ffffff?text=History+of+Nearly+Everything'
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
    imageUrl: 'https://placehold.co/400x600/e11d48/ffffff?text=The+Story+of+Art'
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
    imageUrl: 'https://placehold.co/400x600/f59e0b/ffffff?text=Sapiens'
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
    imageUrl: 'https://placehold.co/400x600/8b5cf6/ffffff?text=World+Religions'
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
    imageUrl: 'https://placehold.co/400x600/4f46e5/ffffff?text=Introduction+to+Algorithms'
  }
];

export const mockPublishers: Publisher[] = [
  { id: '1', name: 'Addison-Wesley', address: '75 Arlington Street, Boston, MA', phone: '617-848-6000' },
  { id: '2', name: 'HarperCollins', address: '195 Broadway, New York, NY', phone: '212-207-7000' },
  { id: '3', name: 'W.W. Norton', address: '500 Fifth Avenue, New York, NY', phone: '212-354-5500' },
  { id: '4', name: 'Wiley', address: '111 River Street, Hoboken, NJ', phone: '201-748-6000' },
  { id: '5', name: 'Knopf', address: '1745 Broadway, New York, NY', phone: '212-782-9000' },
  { id: '6', name: 'Broadway Books', address: '1745 Broadway, New York, NY', phone: '212-782-9000' },
  { id: '7', name: 'Phaidon Press', address: '65 Bleecker Street, New York, NY', phone: '212-652-5400' },
  { id: '8', name: 'Harper', address: '195 Broadway, New York, NY', phone: '212-207-7000' },
  { id: '9', name: 'Oxford University Press', address: '198 Madison Avenue, New York, NY', phone: '212-726-6000' },
  { id: '10', name: 'MIT Press', address: '1 Rogers Street, Cambridge, MA', phone: '617-253-5646' }
];

export const mockPublisherOrders: PublisherOrder[] = [
  {
    id: 'PO-001',
    bookIsbn: '978-0-321-12521-7',
    bookTitle: 'Introduction to Algorithms',
    publisher: 'MIT Press',
    quantity: 20,
    orderDate: '2025-12-15',
    status: 'Pending'
  },
  {
    id: 'PO-002',
    bookIsbn: '978-0-07-352332-7',
    bookTitle: 'Physical Geography',
    publisher: 'Wiley',
    quantity: 15,
    orderDate: '2025-12-10',
    status: 'Confirmed'
  },
  {
    id: 'PO-003',
    bookIsbn: '978-0-13-468599-1',
    bookTitle: 'The Art of Computer Programming',
    publisher: 'Addison-Wesley',
    quantity: 10,
    orderDate: '2025-12-05',
    status: 'Confirmed'
  }
];

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@bookstore.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '555-0100',
    shippingAddress: '123 Admin St, Admin City',
    role: 'admin'
  },
  {
    id: 'cust-1',
    username: 'john_doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-0101',
    shippingAddress: '456 Main St, Springfield, IL 62701',
    role: 'customer'
  },
  {
    id: 'cust-2',
    username: 'jane_smith',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '555-0102',
    shippingAddress: '789 Oak Ave, Chicago, IL 60601',
    role: 'customer'
  }
];

export const mockCustomerOrders: CustomerOrder[] = [
  {
    id: 'ORD-001',
    customerId: 'cust-1',
    orderDate: '2025-12-01',
    items: [
      { isbn: '978-0-06-083865-2', title: 'Sapiens: A Brief History of Humankind', quantity: 2, pricePerUnit: 24.99, totalPrice: 49.98 },
      { isbn: '978-0-06-112008-4', title: 'To Kill a Mockingbird', quantity: 1, pricePerUnit: 14.99, totalPrice: 14.99 }
    ],
    totalAmount: 64.97,
    status: 'Completed'
  },
  {
    id: 'ORD-002',
    customerId: 'cust-1',
    orderDate: '2025-11-28',
    items: [
      { isbn: '978-0-321-12521-7', title: 'Introduction to Algorithms', quantity: 1, pricePerUnit: 95.00, totalPrice: 95.00 }
    ],
    totalAmount: 95.00,
    status: 'Completed'
  },
  {
    id: 'ORD-003',
    customerId: 'cust-2',
    orderDate: '2025-11-15',
    items: [
      { isbn: '978-0-14-028329-7', title: 'The Story of Art', quantity: 1, pricePerUnit: 39.95, totalPrice: 39.95 },
      { isbn: '978-0-19-280722-2', title: 'World Religions', quantity: 2, pricePerUnit: 22.50, totalPrice: 45.00 }
    ],
    totalAmount: 84.95,
    status: 'Completed'
  }
];

// Sales data for reports
export const mockSalesData = [
  { date: '2025-12-17', bookIsbn: '978-0-06-083865-2', quantity: 3, amount: 74.97, customerId: 'cust-1' },
  { date: '2025-12-17', bookIsbn: '978-0-06-112008-4', quantity: 2, amount: 29.98, customerId: 'cust-2' },
  { date: '2025-12-16', bookIsbn: '978-0-321-12521-7', quantity: 1, amount: 95.00, customerId: 'cust-1' },
  { date: '2025-12-15', bookIsbn: '978-0-14-028329-7', quantity: 2, amount: 79.90, customerId: 'cust-2' },
  { date: '2025-12-14', bookIsbn: '978-0-06-083865-2', quantity: 5, amount: 124.95, customerId: 'cust-1' },
  { date: '2025-11-20', bookIsbn: '978-1-59448-273-9', quantity: 4, amount: 72.00, customerId: 'cust-2' },
  { date: '2025-11-18', bookIsbn: '978-0-19-953556-8', quantity: 2, amount: 130.00, customerId: 'cust-1' },
  { date: '2025-11-15', bookIsbn: '978-0-06-093546-7', quantity: 3, amount: 83.85, customerId: 'cust-2' },
  { date: '2025-10-25', bookIsbn: '978-0-06-083865-2', quantity: 8, amount: 199.92, customerId: 'cust-1' },
  { date: '2025-10-20', bookIsbn: '978-0-13-468599-1', quantity: 2, amount: 179.98, customerId: 'cust-2' }
];
