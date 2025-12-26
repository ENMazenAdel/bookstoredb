/**
 * ============================================================================
 * MOCK DATA MODULE - Bookstore Application
 * ============================================================================
 * 
 * This module contains sample data that simulates database records.
 * In a production environment, this data would come from a real database
 * through API calls to a backend server.
 * 
 * DATA INCLUDED:
 * - mockBooks: 10 sample books across different categories
 * - mockPublishers: 10 publisher records
 * - mockPublisherOrders: Sample replenishment orders
 * - mockUsers: 3 users (1 admin, 2 customers)
 * - mockCustomerOrders: Sample customer purchase history
 * - mockSalesData: Sales transactions for report generation
 * 
 * NOTE: This data is loaded into memory on application start.
 * Changes made during runtime are not persisted across page refreshes.
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// Import TypeScript interfaces for type safety
import { Book, Publisher, PublisherOrder, User, CustomerOrder } from '../types';

// ============================================================================
// BOOKS DATA
// ============================================================================
/**
 * Sample book inventory data
 * 
 * Each book contains:
 * - isbn: Primary key, unique identifier (ISBN-13 format)
 * - title: Book title
 * - authors: Array of author names
 * - publisher: Publisher name (foreign key reference)
 * - publicationYear: Year of publication
 * - sellingPrice: Current selling price in USD
 * - category: Book category (Science, Art, History, Geography, Religion)
 * - quantity: Current stock level
 * - threshold: Minimum stock level before auto-replenishment
 * - imageUrl: URL to book cover image
 * 
 * CATEGORIES AVAILABLE:
 * - Science: Computer science, general science
 * - Art: Literature, visual arts
 * - History: Historical texts
 * - Geography: Geographic and environmental studies
 * - Religion: Religious and philosophical texts
 */
export const mockBooks: Book[] = [
  // ==================== SCIENCE CATEGORY ====================
  {
    isbn: '978-0-13-468599-1',
    title: 'The Art of Computer Programming',
    authors: ['Donald Knuth'],
    publisher: 'Addison-Wesley',
    publicationYear: 2011,
    sellingPrice: 89.99,
    category: 'Science',
    quantity: 25,
    threshold: 5,            // Reorder when stock drops below 5
    imageUrl: 'https://placehold.co/400x600/4f46e5/ffffff?text=The+Art+of+Computer+Programming'
  },
  // ==================== ART CATEGORY ====================
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
  // ==================== HISTORY CATEGORY ====================
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
  // ==================== GEOGRAPHY CATEGORY ====================
  {
    isbn: '978-0-07-352332-7',
    title: 'Physical Geography',
    authors: ['Alan Strahler', 'Arthur Strahler'],  // Multiple authors example
    publisher: 'Wiley',
    publicationYear: 2013,
    sellingPrice: 120.00,
    category: 'Geography',
    quantity: 8,
    threshold: 5,
    imageUrl: 'https://placehold.co/400x600/10b981/ffffff?text=Physical+Geography'
  },
  // ==================== RELIGION CATEGORY ====================
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
  // More Science books
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
  // More Art books
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
  // More History books
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
  // More Religion books
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
  // LOW STOCK EXAMPLE - This book triggers auto-replenishment
  {
    isbn: '978-0-321-12521-7',
    title: 'Introduction to Algorithms',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest'],  // 3 authors
    publisher: 'MIT Press',
    publicationYear: 2009,
    sellingPrice: 95.00,
    category: 'Science',
    quantity: 3,             // Currently below threshold!
    threshold: 5,
    imageUrl: 'https://placehold.co/400x600/4f46e5/ffffff?text=Introduction+to+Algorithms'
  }
];

// ============================================================================
// PUBLISHERS DATA
// ============================================================================
/**
 * Sample publisher data
 * 
 * Publishers are the suppliers who provide books to the bookstore.
 * Each publisher contains:
 * - id: Primary key, unique identifier
 * - name: Publisher company name
 * - address: Business address
 * - phone: Contact phone number
 * 
 * These publishers are referenced by books through the 'publisher' field.
 */
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

// ============================================================================
// PUBLISHER ORDERS DATA (Replenishment Orders)
// ============================================================================
/**
 * Sample publisher replenishment order data
 * 
 * These are orders placed by the bookstore to publishers for restocking.
 * Orders can be:
 * - Created manually by admin
 * - Created automatically when stock drops below threshold (trigger)
 * 
 * ORDER STATUS VALUES:
 * - 'Pending': Order placed but not yet confirmed/received
 * - 'Confirmed': Order confirmed and stock has been added to inventory
 * - 'Cancelled': Order was cancelled
 * 
 * Each order contains:
 * - id: Unique order identifier (format: PO-XXX)
 * - bookIsbn: ISBN of the book being ordered (foreign key)
 * - bookTitle: Title of the book (denormalized for display)
 * - publisher: Publisher name
 * - quantity: Number of copies ordered
 * - orderDate: Date the order was placed (YYYY-MM-DD format)
 * - status: Current order status
 */
export const mockPublisherOrders: PublisherOrder[] = [
  // Pending order - waiting for admin confirmation
  {
    id: 'PO-001',
    bookIsbn: '978-0-321-12521-7',
    bookTitle: 'Introduction to Algorithms',
    publisher: 'MIT Press',
    quantity: 20,
    orderDate: '2025-12-15',
    status: 'Pending'
  },
  // Confirmed order - stock has been received and added
  {
    id: 'PO-002',
    bookIsbn: '978-0-07-352332-7',
    bookTitle: 'Physical Geography',
    publisher: 'Wiley',
    quantity: 15,
    orderDate: '2025-12-10',
    status: 'Confirmed'
  },
  // Another confirmed order
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

// ============================================================================
// USERS DATA
// ============================================================================
/**
 * Sample user account data
 * 
 * USER ROLES:
 * - 'admin': Can manage books, view reports, manage orders
 * - 'customer': Can browse books, add to cart, checkout, view order history
 * 
 * Each user contains:
 * - id: Unique identifier (format: admin-X or cust-X)
 * - username: Login username
 * - email: Email address
 * - firstName, lastName: User's name
 * - phone: Contact phone number
 * - shippingAddress: Delivery address (for customers)
 * - role: User role ('admin' or 'customer')
 * 
 * DEMO CREDENTIALS:
 * - Admin login: username="admin", password="admin"
 * - Customer login: use any username with password="password"
 */
export const mockUsers: User[] = [
  // Administrator account - has full access to management features
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
  // Customer account #1 - John Doe
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
  // Customer account #2 - Jane Smith
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

// ============================================================================
// CUSTOMER ORDERS DATA (Purchase History)
// ============================================================================
/**
 * Sample customer order history data
 * 
 * These represent completed purchases made by customers.
 * Each order is linked to a customer and contains the items purchased.
 * 
 * ORDER STATUS:
 * - 'Completed': Order has been fulfilled
 * - 'Pending': Order is being processed (not used in sample data)
 * - 'Cancelled': Order was cancelled (not used in sample data)
 * 
 * Each order contains:
 * - id: Unique order identifier (format: ORD-XXX)
 * - customerId: ID of the customer who placed the order (foreign key)
 * - orderDate: Date the order was placed (YYYY-MM-DD format)
 * - items: Array of order items with ISBN, title, quantity, prices
 * - totalAmount: Total order value in USD
 * - status: Order status
 */
export const mockCustomerOrders: CustomerOrder[] = [
  // Order from John Doe - multiple items
  {
    id: 'ORD-001',
    customerId: 'cust-1',               // Foreign key to John Doe
    orderDate: '2025-12-01',
    items: [
      { isbn: '978-0-06-083865-2', title: 'Sapiens: A Brief History of Humankind', quantity: 2, pricePerUnit: 24.99, totalPrice: 49.98 },
      { isbn: '978-0-06-112008-4', title: 'To Kill a Mockingbird', quantity: 1, pricePerUnit: 14.99, totalPrice: 14.99 }
    ],
    totalAmount: 64.97,
    status: 'Completed'
  },
  // Another order from John Doe - single expensive item
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
  // Order from Jane Smith - multiple items
  {
    id: 'ORD-003',
    customerId: 'cust-2',               // Foreign key to Jane Smith
    orderDate: '2025-11-15',
    items: [
      { isbn: '978-0-14-028329-7', title: 'The Story of Art', quantity: 1, pricePerUnit: 39.95, totalPrice: 39.95 },
      { isbn: '978-0-19-280722-2', title: 'World Religions', quantity: 2, pricePerUnit: 22.50, totalPrice: 45.00 }
    ],
    totalAmount: 84.95,
    status: 'Completed'
  }
];

// ============================================================================
// SALES DATA (For Reports)
// ============================================================================
/**
 * Sales transaction data for generating reports
 * 
 * This data is used by the reportsApi to calculate:
 * - Monthly sales totals
 * - Daily sales totals
 * - Top selling books (by copies sold)
 * - Top customers (by purchase amount)
 * 
 * Each transaction contains:
 * - date: Transaction date (YYYY-MM-DD format)
 * - bookIsbn: ISBN of the book sold
 * - quantity: Number of copies sold in this transaction
 * - amount: Total sale amount in USD
 * - customerId: ID of the purchasing customer
 * 
 * NOTE: This data spans multiple months to support reporting features
 */
export const mockSalesData = [
  // December 2025 sales (recent)
  { date: '2025-12-17', bookIsbn: '978-0-06-083865-2', quantity: 3, amount: 74.97, customerId: 'cust-1' },
  { date: '2025-12-17', bookIsbn: '978-0-06-112008-4', quantity: 2, amount: 29.98, customerId: 'cust-2' },
  { date: '2025-12-16', bookIsbn: '978-0-321-12521-7', quantity: 1, amount: 95.00, customerId: 'cust-1' },
  { date: '2025-12-15', bookIsbn: '978-0-14-028329-7', quantity: 2, amount: 79.90, customerId: 'cust-2' },
  { date: '2025-12-14', bookIsbn: '978-0-06-083865-2', quantity: 5, amount: 124.95, customerId: 'cust-1' },
  // November 2025 sales
  { date: '2025-11-20', bookIsbn: '978-1-59448-273-9', quantity: 4, amount: 72.00, customerId: 'cust-2' },
  { date: '2025-11-18', bookIsbn: '978-0-19-953556-8', quantity: 2, amount: 130.00, customerId: 'cust-1' },
  { date: '2025-11-15', bookIsbn: '978-0-06-093546-7', quantity: 3, amount: 83.85, customerId: 'cust-2' },
  // October 2025 sales (older)
  { date: '2025-10-25', bookIsbn: '978-0-06-083865-2', quantity: 8, amount: 199.92, customerId: 'cust-1' },
  { date: '2025-10-20', bookIsbn: '978-0-13-468599-1', quantity: 2, amount: 179.98, customerId: 'cust-2' }
];
