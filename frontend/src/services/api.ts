/**
 * ============================================================================
 * API SERVICE MODULE - Bookstore Application
 * ============================================================================
 * 
 * This module contains all API functions for the bookstore application.
 * It simulates a backend API using in-memory data storage.
 * 
 * In a production environment, these functions would make HTTP requests
 * to a real backend server (Node.js, Django, etc.).
 * 
 * The module is organized into the following API sections:
 * - authApi: Authentication operations (login, register, logout, profile)
 * - booksApi: CRUD operations for books with trigger logic
 * - publishersApi: Publisher data retrieval
 * - ordersApi: Publisher replenishment order management
 * - cartApi: Shopping cart operations for customers
 * - customerOrdersApi: Customer order history
 * - reportsApi: Sales analytics and business reports
 * 
 * KEY FEATURES:
 * - Simulates database triggers (auto-replenishment, stock validation)
 * - Per-user shopping carts with localStorage persistence
 * - Payment validation during checkout
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// ============================================================================
// TYPE IMPORTS
// ============================================================================
// Import TypeScript interfaces for type safety across all API operations

import {
  Book,              // Book entity - represents a book in the inventory
  BookFormData,      // Form data structure for creating/editing books
  Publisher,         // Publisher entity - book suppliers
  PublisherOrder,    // Order placed to publishers for restocking
  User,              // User entity - customers and admins
  LoginCredentials,  // Login form data (username, password)
  RegisterData,      // Registration form data
  CustomerOrder,     // Completed customer purchase order
  Cart,              // Shopping cart with items and totals
  CheckoutData,      // Payment information for checkout
  SalesReport,       // Aggregated sales statistics
  BookSalesReport,   // Book-specific sales data
  TopCustomer,       // Customer ranking by purchase amount
  BookOrderCount     // Publisher order count for a specific book
} from '../types';

// ============================================================================
// MOCK DATA IMPORTS
// ============================================================================
// Import sample data that simulates database records
// In production, this data would come from a real database

import {
  mockBooks,           // 10 sample book records
  mockPublishers,      // 10 sample publisher records
  mockPublisherOrders, // Sample publisher order records
  mockUsers,           // 3 sample users (1 admin, 2 customers)
  mockUserPasswords,   // Hashed passwords for users
  mockCustomerOrders,  // Sample customer order history
  mockSalesData        // Sales transaction data for reports
} from './mockData';

// Import password hashing utilities
import { hashPassword, verifyPassword } from './passwordHash';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simulates network delay to mimic real API behavior
 * Makes the UI feel more realistic by adding loading states
 * 
 * @param ms - Number of milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// IN-MEMORY DATA STORES (Simulating Database Tables)
// ============================================================================
// These arrays act as our "database tables" for the mock API.
// They are initialized with mock data and modified during runtime.
// Note: Data is lost when the page refreshes (no persistence).

let books = [...mockBooks];                    // Books "table" - inventory
let publishers = [...mockPublishers];          // Publishers "table"
let publisherOrders = [...mockPublisherOrders]; // Publisher orders "table"
let users = [...mockUsers];                    // Users "table" - accounts
let userPasswords = new Map(mockUserPasswords); // User passwords "table" - hashed passwords
let customerOrders = [...mockCustomerOrders];  // Customer orders "table"

// ============================================================================
// CART MANAGEMENT SYSTEM
// ============================================================================
// Manages user-specific shopping carts using a Map data structure.
// Each user has their own isolated cart that persists during their session.

/**
 * Map to store user-specific shopping carts
 * Key: userId (string) - The unique identifier of the user
 * Value: Cart object - Contains items, totalItems, and totalPrice
 */
const userCarts = new Map<string, Cart>();

/**
 * Tracks the currently logged-in user's ID
 * Used to associate cart operations with the correct user
 * Set to null when no user is logged in
 */
let currentUserId: string | null = null;

/**
 * Initializes the current user from localStorage on module load
 * This ensures the user's session persists across page refreshes
 * Called automatically when the module is imported
 */
const initializeUser = () => {
  // Attempt to retrieve stored user data from browser's localStorage
  const storedUser = localStorage.getItem('bookstore_user');
  if (storedUser) {
    try {
      // Parse the stored JSON and extract the user ID
      const user = JSON.parse(storedUser);
      currentUserId = user.id;
    } catch {
      // If JSON parsing fails, the stored data is corrupted
      // AuthContext will handle clearing this invalid data
    }
  }
};

// Execute initialization immediately when the module loads
initializeUser();

/**
 * Retrieves the shopping cart for the current user
 * Creates an empty cart if the user doesn't have one yet
 * 
 * @returns The current user's Cart object
 */
const getCart = (): Cart => {
  // If no user is logged in, return an empty cart
  if (!currentUserId) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }
  // If user doesn't have a cart yet, create an empty one
  if (!userCarts.has(currentUserId)) {
    userCarts.set(currentUserId, { items: [], totalItems: 0, totalPrice: 0 });
  }
  // Return the user's existing cart
  return userCarts.get(currentUserId)!;
};

/**
 * Saves the cart for the current user
 * Updates the cart in the userCarts Map
 * 
 * @param cart - The Cart object to save
 */
const setCart = (cart: Cart): void => {
  if (currentUserId) {
    userCarts.set(currentUserId, cart);
  }
};

// ============================================================================
// AUTHENTICATION API
// ============================================================================
/**
 * Authentication API Module
 * Handles user authentication operations including login, registration,
 * profile updates, and logout functionality.
 * 
 * DEMO CREDENTIALS:
 * - Admin: username="admin", password="admin"
 * - Customers: any existing username with password="password"
 */
export const authApi = {
  /**
   * Authenticates a user with username and password
   * Sets the currentUserId for cart association upon successful login
   * 
   * @param credentials - Object containing username and password
   * @returns Promise resolving to the authenticated User object
   * @throws Error if credentials are invalid
   * 
   * @example
   * const user = await authApi.login({ username: 'admin', password: 'admin' });
   */
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(500); // Simulate network latency
    
    // Find user by username
    const user = users.find(u => u.username === credentials.username);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Get stored hashed password for this user
    const storedHash = userPasswords.get(user.id);
    
    if (!storedHash) {
      throw new Error('Invalid username or password');
    }
    
    // Verify password using hash comparison
    const isValidPassword = await verifyPassword(credentials.password, storedHash);
    
    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }
    
    // Password verified - set current user for cart operations
    currentUserId = user.id;
    return user;
  },

  /**
   * Registers a new customer account
   * Validates username and email uniqueness before creating the account
   * Automatically logs in the new user after registration
   * 
   * @param data - Registration form data (username, email, name, phone, address)
   * @returns Promise resolving to the newly created User object
   * @throws Error if username or email already exists
   * 
   * @example
   * const newUser = await authApi.register({
   *   username: 'johndoe',
   *   email: 'john@example.com',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   phone: '123-456-7890',
   *   shippingAddress: '123 Main St'
   * });
   */
  register: async (data: RegisterData): Promise<User> => {
    await delay(500);
    
    // Check for duplicate username (UNIQUE constraint)
    if (users.some(u => u.username === data.username)) {
      throw new Error('Username already exists');
    }
    
    // Check for duplicate email (UNIQUE constraint)
    if (users.some(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }
    
    // Create new user object with unique ID
    const newUser: User = {
      id: `cust-${Date.now()}`,        // Generate unique ID using timestamp
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      shippingAddress: data.shippingAddress,
      role: 'customer'                  // New registrations are always customers
    };
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(data.password);
    
    // Add to users "table"
    users.push(newUser);
    
    // Store hashed password in passwords "table"
    userPasswords.set(newUser.id, hashedPassword);
    
    // Auto-login the new user
    currentUserId = newUser.id;
    
    return newUser;
  },

  /**
   * Updates a user's profile information
   * Merges the new data with existing user data
   * 
   * @param userId - ID of the user to update
   * @param data - Partial User object with fields to update
   * @returns Promise resolving to the updated User object
   * @throws Error if user not found
   */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await delay(300);
    
    // Find user index in the array
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    // Merge existing user data with updates (spread operator)
    users[index] = { ...users[index], ...data };
    
    return users[index];
  },

  /**
   * Logs out the current user
   * Clears the currentUserId (cart remains in memory if they log back in)
   */
  logout: async (): Promise<void> => {
    await delay(200);
    currentUserId = null; // Clear current user reference
  }
};

// ============================================================================
// BOOKS API
// ============================================================================
/**
 * Books API Module
 * Handles all book-related CRUD (Create, Read, Update, Delete) operations.
 * 
 * IMPORTANT: This module implements DATABASE TRIGGERS:
 * 1. CHECK constraint: Prevents negative book quantity
 * 2. AUTO-REPLENISH trigger: Automatically places publisher orders when
 *    stock drops below the threshold
 */
export const booksApi = {
  /**
   * Retrieves all books from the inventory
   * Returns a copy to prevent direct mutation of the data store
   * 
   * @returns Promise resolving to array of all Book objects
   */
  getAll: async (): Promise<Book[]> => {
    await delay(300);
    return [...books]; // Return copy, not reference
  },

  /**
   * Retrieves a single book by its ISBN (primary key)
   * 
   * @param isbn - The ISBN of the book to find
   * @returns Promise resolving to Book object or undefined if not found
   */
  getByIsbn: async (isbn: string): Promise<Book | undefined> => {
    await delay(200);
    return books.find(b => b.isbn === isbn);
  },

  /**
   * Searches books by query string with optional filters
   * Performs case-insensitive search in: ISBN, title, and author names
   * 
   * @param query - Search string to match against book fields
   * @param filter - Optional filters for category, author, publisher
   * @returns Promise resolving to array of matching Book objects
   * 
   * @example
   * // Search for "Harry" in any field
   * const results = await booksApi.search('Harry');
   * 
   * // Search with filters
   * const filtered = await booksApi.search('', { category: 'Fiction' });
   */
  search: async (query: string, filter?: { category?: string; author?: string; publisher?: string }): Promise<Book[]> => {
    await delay(300);
    
    // First, filter by search query (case-insensitive matching)
    let results = books.filter(book =>
      book.isbn.toLowerCase().includes(query.toLowerCase()) ||
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.authors.some(a => a.toLowerCase().includes(query.toLowerCase()))
    );

    // Apply category filter if provided
    if (filter?.category) {
      results = results.filter(b => b.category === filter.category);
    }
    
    // Apply author filter if provided
    if (filter?.author) {
      results = results.filter(b => b.authors.some(a => a.toLowerCase().includes(filter.author!.toLowerCase())));
    }
    
    // Apply publisher filter if provided
    if (filter?.publisher) {
      results = results.filter(b => b.publisher.toLowerCase().includes(filter.publisher!.toLowerCase()));
    }

    return results;
  },

  /**
   * Adds a new book to the inventory
   * Validates that ISBN is unique (primary key constraint)
   * 
   * @param data - Book form data including ISBN, title, authors, prices, etc.
   * @returns Promise resolving to the newly created Book object
   * @throws Error if ISBN already exists (unique constraint violation)
   */
  add: async (data: BookFormData): Promise<Book> => {
    await delay(400);
    
    // Check for duplicate ISBN (PRIMARY KEY constraint)
    if (books.some(b => b.isbn === data.isbn)) {
      throw new Error('Book with this ISBN already exists');
    }
    
    // Create new book object
    const newBook: Book = {
      ...data,
      // Convert comma-separated authors string to array
      authors: data.authors.split(',').map(a => a.trim()),
      // Generate placeholder image URL based on title
      imageUrl: `https://via.placeholder.com/150x200?text=${encodeURIComponent(data.title.substring(0, 10))}`
    };
    
    // Add to books "table"
    books.push(newBook);
    
    return newBook;
  },

  /**
   * Updates an existing book's information
   * 
   * IMPLEMENTS TWO DATABASE TRIGGERS:
   * 
   * 1. CHECK CONSTRAINT - Prevents quantity from going negative
   *    Throws error if update would result in negative stock
   * 
   * 2. AUTO-REPLENISH TRIGGER - When quantity drops below threshold:
   *    - Automatically creates a publisher order for 20 copies
   *    - Order status is set to 'Pending' for admin confirmation
   * 
   * @param isbn - ISBN of the book to update
   * @param data - Partial Book object with fields to update
   * @returns Promise resolving to the updated Book object
   * @throws Error if book not found or quantity would become negative
   */
  update: async (isbn: string, data: Partial<Book>): Promise<Book> => {
    await delay(300);
    
    // Find book index in the array
    const index = books.findIndex(b => b.isbn === isbn);
    if (index === -1) throw new Error('Book not found');

    // =========================================
    // TRIGGER 1: CHECK CONSTRAINT
    // Prevent negative stock quantity
    // Equivalent to: CHECK (quantity >= 0)
    // =========================================
    if (data.quantity !== undefined && data.quantity < 0) {
      throw new Error('Book quantity cannot be negative');
    }

    // Store old quantity for trigger comparison
    const oldQuantity = books[index].quantity;
    
    // Apply updates using spread operator
    books[index] = { ...books[index], ...data };

    // =========================================
    // TRIGGER 2: AUTO-REPLENISH
    // Automatically order from publisher when stock is low
    // Fires when: quantity transitions from >= threshold to < threshold
    // =========================================
    if (data.quantity !== undefined && oldQuantity >= books[index].threshold && data.quantity < books[index].threshold) {
      // Create automatic replenishment order
      const autoOrder: PublisherOrder = {
        id: `PO-${Date.now()}`,                    // Unique order ID
        bookIsbn: isbn,
        bookTitle: books[index].title,
        publisher: books[index].publisher,
        quantity: 20,                              // Fixed reorder quantity
        orderDate: new Date().toISOString().split('T')[0], // Today's date
        status: 'Pending'                          // Awaits admin confirmation
      };
      
      // Add to publisher orders "table"
      publisherOrders.push(autoOrder);
      
      // Log for debugging/monitoring
      console.log('Auto-order placed:', autoOrder);
    }

    return books[index];
  },

  /**
   * Deletes a book from the inventory
   * Note: In a real application, this should check for references
   * in orders before allowing deletion (referential integrity)
   * 
   * @param isbn - ISBN of the book to delete
   */
  delete: async (isbn: string): Promise<void> => {
    await delay(300);
    // Filter out the book with matching ISBN
    books = books.filter(b => b.isbn !== isbn);
  }
};

// ============================================================================
// PUBLISHERS API
// ============================================================================
/**
 * Publishers API Module
 * Handles publisher data retrieval
 * Publishers are the suppliers who provide books to the bookstore
 */
export const publishersApi = {
  /**
   * Retrieves all publishers from the database
   * 
   * @returns Promise resolving to array of all Publisher objects
   */
  getAll: async (): Promise<Publisher[]> => {
    await delay(200);
    return [...publishers]; // Return copy to prevent mutation
  }
};

// ============================================================================
// PUBLISHER ORDERS API (Replenishment Orders)
// ============================================================================
/**
 * Publisher Orders API Module
 * Handles replenishment orders placed to publishers for restocking inventory.
 * 
 * These orders can be created in two ways:
 * 1. MANUALLY by admin through the order management interface
 * 2. AUTOMATICALLY by the auto-replenish trigger when stock drops below threshold
 * 
 * Order Lifecycle: Pending → Confirmed/Cancelled
 * When confirmed, the ordered quantity is added to book stock (trigger)
 */
export const ordersApi = {
  /**
   * Retrieves all publisher orders
   * 
   * @returns Promise resolving to array of all PublisherOrder objects
   */
  getAll: async (): Promise<PublisherOrder[]> => {
    await delay(300);
    return [...publisherOrders];
  },

  /**
   * Places a new publisher order for restocking a book
   * Used by admin to manually order more copies of a book
   * 
   * @param bookIsbn - ISBN of the book to reorder
   * @param quantity - Number of copies to order (default: 20)
   * @returns Promise resolving to the newly created PublisherOrder
   * @throws Error if book not found
   */
  place: async (bookIsbn: string, quantity: number = 20): Promise<PublisherOrder> => {
    await delay(400);
    
    // Validate that the book exists
    const book = books.find(b => b.isbn === bookIsbn);
    if (!book) throw new Error('Book not found');

    // Create new order object
    const order: PublisherOrder = {
      id: `PO-${Date.now()}`,                    // Unique order ID
      bookIsbn,
      bookTitle: book.title,
      publisher: book.publisher,
      quantity,
      orderDate: new Date().toISOString().split('T')[0], // Today's date (YYYY-MM-DD)
      status: 'Pending'                          // New orders start as Pending
    };
    
    // Add to publisher orders "table"
    publisherOrders.push(order);
    
    return order;
  },

  /**
   * Confirms a pending publisher order
   * 
   * IMPLEMENTS TRIGGER: Updates book stock when order is confirmed
   * - Adds the ordered quantity to the book's inventory
   * - Similar to receiving a shipment from the publisher
   * 
   * @param orderId - ID of the order to confirm
   * @returns Promise resolving to the updated PublisherOrder
   * @throws Error if order not found or not in Pending status
   */
  confirm: async (orderId: string): Promise<PublisherOrder> => {
    await delay(400);
    
    // Find the order in the array
    const orderIndex = publisherOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');
    
    // Validate that order is still pending
    if (publisherOrders[orderIndex].status !== 'Pending') {
      throw new Error('Order is not pending');
    }

    // Update order status to Confirmed
    publisherOrders[orderIndex].status = 'Confirmed';

    // =========================================
    // TRIGGER: UPDATE STOCK ON CONFIRM
    // Add the ordered quantity to book inventory
    // Simulates receiving the shipment from publisher
    // =========================================
    const bookIndex = books.findIndex(b => b.isbn === publisherOrders[orderIndex].bookIsbn);
    if (bookIndex !== -1) {
      books[bookIndex].quantity += publisherOrders[orderIndex].quantity;
    }

    return publisherOrders[orderIndex];
  },

  /**
   * Cancels a publisher order
   * Does not affect book stock since order was never fulfilled
   * 
   * @param orderId - ID of the order to cancel
   * @returns Promise resolving to the updated PublisherOrder
   * @throws Error if order not found
   */
  cancel: async (orderId: string): Promise<PublisherOrder> => {
    await delay(300);
    
    const orderIndex = publisherOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');
    
    // Update status to Cancelled
    publisherOrders[orderIndex].status = 'Cancelled';
    
    return publisherOrders[orderIndex];
  }
};

// ============================================================================
// SHOPPING CART API
// ============================================================================
/**
 * Cart API Module
 * Handles all shopping cart operations for customers.
 * 
 * KEY FEATURES:
 * - Per-user cart isolation (each user has their own cart)
 * - Stock validation before adding items
 * - Automatic total recalculation
 * - Payment validation during checkout
 * - Triggers auto-replenish when checkout depletes stock below threshold
 */
export const cartApi = {
  /**
   * Retrieves the current user's shopping cart
   * Returns a copy to prevent direct mutation
   * 
   * @returns Promise resolving to the Cart object
   */
  get: async (): Promise<Cart> => {
    await delay(100);
    return { ...getCart() }; // Return copy, not reference
  },

  /**
   * Adds a book to the cart or increases quantity if already in cart
   * Validates stock availability before adding
   * 
   * @param isbn - ISBN of the book to add
   * @param quantity - Number of copies to add (default: 1)
   * @returns Promise resolving to the updated Cart
   * @throws Error if book not found or insufficient stock
   */
  addItem: async (isbn: string, quantity: number = 1): Promise<Cart> => {
    await delay(200);
    
    // Validate that the book exists
    const book = books.find(b => b.isbn === isbn);
    if (!book) throw new Error('Book not found');
    
    // Check stock availability
    if (book.quantity < quantity) throw new Error('Not enough stock available');

    const cart = getCart();
    
    // Check if book is already in cart
    const existingItem = cart.items.find(item => item.book.isbn === isbn);
    
    if (existingItem) {
      // Book already in cart - increase quantity
      // Validate that total quantity doesn't exceed available stock
      if (existingItem.quantity + quantity > book.quantity) {
        throw new Error('Not enough stock available');
      }
      existingItem.quantity += quantity;
    } else {
      // New item - add to cart
      cart.items.push({ book, quantity });
    }

    // Recalculate totals and save cart
    recalculateCart(cart);
    setCart(cart);
    
    return { ...cart };
  },

  /**
   * Updates the quantity of a book in the cart
   * If quantity is 0 or less, removes the item from cart
   * 
   * @param isbn - ISBN of the book to update
   * @param quantity - New quantity for the item
   * @returns Promise resolving to the updated Cart
   * @throws Error if item not in cart or insufficient stock
   */
  updateQuantity: async (isbn: string, quantity: number): Promise<Cart> => {
    await delay(200);
    
    // If quantity is 0 or negative, remove the item entirely
    if (quantity <= 0) {
      return cartApi.removeItem(isbn);
    }

    const cart = getCart();
    
    // Find item in cart
    const item = cart.items.find(i => i.book.isbn === isbn);
    if (!item) throw new Error('Item not in cart');

    // Validate stock availability for new quantity
    const book = books.find(b => b.isbn === isbn);
    if (!book || book.quantity < quantity) throw new Error('Not enough stock available');

    // Update quantity
    item.quantity = quantity;
    
    // Recalculate totals and save
    recalculateCart(cart);
    setCart(cart);
    
    return { ...cart };
  },

  /**
   * Removes a book from the cart entirely
   * 
   * @param isbn - ISBN of the book to remove
   * @returns Promise resolving to the updated Cart
   */
  removeItem: async (isbn: string): Promise<Cart> => {
    await delay(200);
    
    const cart = getCart();
    
    // Filter out the item with matching ISBN
    cart.items = cart.items.filter(item => item.book.isbn !== isbn);
    
    // Recalculate totals and save
    recalculateCart(cart);
    setCart(cart);
    
    return { ...cart };
  },

  /**
   * Clears all items from the cart
   * 
   * @returns Promise resolving to an empty Cart
   */
  clear: async (): Promise<Cart> => {
    await delay(100);
    
    // Create empty cart
    const emptyCart = { items: [], totalItems: 0, totalPrice: 0 };
    setCart(emptyCart);
    
    return { ...emptyCart };
  },

  /**
   * Processes checkout - validates payment, creates order, updates stock
   * 
   * CHECKOUT PROCESS:
   * 1. Validate credit card number (minimum 13 digits)
   * 2. Validate expiry date format (MM/YY)
   * 3. Verify cart is not empty
   * 4. Validate stock availability for all items
   * 5. Create customer order record
   * 6. Deduct quantities from book inventory
   * 7. TRIGGER: Auto-replenish if stock drops below threshold
   * 8. Clear the shopping cart
   * 
   * @param checkoutData - Payment information (credit card number, expiry, CVV)
   * @param _userId - ID of the customer placing the order
   * @returns Promise resolving to the created CustomerOrder
   * @throws Error for invalid payment, empty cart, or insufficient stock
   */
  checkout: async (checkoutData: CheckoutData, _userId: string): Promise<CustomerOrder> => {
    await delay(800); // Longer delay to simulate payment processing

    // =========================================
    // PAYMENT VALIDATION
    // Simple validation for demonstration purposes
    // In production, this would integrate with a payment gateway
    // (Stripe, PayPal, etc.)
    // =========================================
    
    // Validate credit card number (minimum 13 digits for valid cards)
    if (!checkoutData.creditCardNumber || checkoutData.creditCardNumber.length < 13) {
      throw new Error('Invalid credit card number');
    }
    
    // Validate expiry date format (must be MM/YY)
    if (!checkoutData.expiryDate || !/^\d{2}\/\d{2}$/.test(checkoutData.expiryDate)) {
      throw new Error('Invalid expiry date format (MM/YY)');
    }

    const cart = getCart();
    
    // Ensure cart is not empty
    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // =========================================
    // STOCK VALIDATION
    // Verify all items are still available before processing
    // Stock may have changed since items were added to cart
    // =========================================
    for (const item of cart.items) {
      const book = books.find(b => b.isbn === item.book.isbn);
      if (!book || book.quantity < item.quantity) {
        throw new Error(`Not enough stock for "${item.book.title}". Available: ${book?.quantity || 0}`);
      }
    }

    // =========================================
    // CREATE CUSTOMER ORDER
    // =========================================
    const order: CustomerOrder = {
      id: `ORD-${Date.now()}`,           // Unique order ID
      customerId: _userId,                // Foreign key to customer
      orderDate: new Date().toISOString().split('T')[0], // Today's date
      items: cart.items.map(item => ({
        isbn: item.book.isbn,
        title: item.book.title,
        quantity: item.quantity,
        pricePerUnit: item.book.sellingPrice,
        totalPrice: item.quantity * item.book.sellingPrice
      })),
      totalAmount: cart.totalPrice,
      status: 'Completed'                 // Order is immediately completed
    };

    // =========================================
    // UPDATE INVENTORY & AUTO-REPLENISH TRIGGER
    // Deduct purchased quantities from stock
    // If stock drops below threshold, create publisher order
    // =========================================
    for (const item of cart.items) {
      const bookIndex = books.findIndex(b => b.isbn === item.book.isbn);
      if (bookIndex !== -1) {
        const oldQuantity = books[bookIndex].quantity;
        
        // Deduct sold quantity from inventory
        books[bookIndex].quantity -= item.quantity;

        // =========================================
        // TRIGGER: AUTO-REPLENISH
        // If stock dropped below threshold, automatically
        // create a publisher order for restocking
        // =========================================
        if (oldQuantity >= books[bookIndex].threshold && books[bookIndex].quantity < books[bookIndex].threshold) {
          const autoOrder: PublisherOrder = {
            id: `PO-${Date.now()}-${item.book.isbn}`,
            bookIsbn: item.book.isbn,
            bookTitle: books[bookIndex].title,
            publisher: books[bookIndex].publisher,
            quantity: 20,                        // Fixed reorder quantity
            orderDate: new Date().toISOString().split('T')[0],
            status: 'Pending'
          };
          publisherOrders.push(autoOrder);
        }
      }
    }

    // Add order to customer orders "table"
    customerOrders.push(order);

    // Clear the cart after successful checkout
    setCart({ items: [], totalItems: 0, totalPrice: 0 });

    return order;
  }
};

/**
 * Recalculates cart totals after any modification
 * Updates totalItems (sum of quantities) and totalPrice (sum of item prices)
 * 
 * @param cart - The Cart object to recalculate
 */
function recalculateCart(cart: Cart) {
  // Sum up all item quantities
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Sum up all item prices (quantity × price per unit)
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.book.sellingPrice), 0);
}

// ============================================================================
// CUSTOMER ORDERS API
// ============================================================================
/**
 * Customer Orders API Module
 * Handles retrieval of customer order history.
 * Orders are created during checkout and stored for historical reference.
 */
export const customerOrdersApi = {
  /**
   * Retrieves all orders for a specific customer
   * Used to display order history in the customer's profile
   * 
   * @param customerId - ID of the customer
   * @returns Promise resolving to array of CustomerOrder objects
   */
  getByCustomer: async (customerId: string): Promise<CustomerOrder[]> => {
    await delay(300);
    // Filter orders by customer ID (foreign key relationship)
    return customerOrders.filter(o => o.customerId === customerId);
  },

  /**
   * Retrieves a single order by its ID
   * Used to display order details
   * 
   * @param orderId - ID of the order to retrieve
   * @returns Promise resolving to CustomerOrder or undefined if not found
   */
  getById: async (orderId: string): Promise<CustomerOrder | undefined> => {
    await delay(200);
    return customerOrders.find(o => o.id === orderId);
  }
};

// ============================================================================
// REPORTS API
// ============================================================================
/**
 * Reports API Module
 * Handles generation of business analytics and reports.
 * Used by administrators for monitoring sales performance and inventory.
 * 
 * AVAILABLE REPORTS:
 * - Monthly Sales: Total revenue and order count for previous month
 * - Daily Sales: Sales statistics for a specific date
 * - Top Customers: Top 5 customers by purchase amount (last 3 months)
 * - Top Selling Books: Top 10 books by copies sold (last 3 months)
 * - Book Order Count: Number of publisher orders for a specific book
 */
export const reportsApi = {
  /**
   * Generates sales report for the previous month
   * Calculates total revenue and order count
   * 
   * @returns Promise resolving to SalesReport with total sales and order count
   */
  getMonthlySales: async (): Promise<SalesReport> => {
    await delay(400);
    
    const now = new Date();
    
    // Calculate date range for previous month
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);      // First day of last month
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);       // Last day of last month

    // Filter sales data for the previous month
    const sales = mockSalesData.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= lastMonth && saleDate <= lastMonthEnd;
    });

    return {
      totalSales: sales.reduce((sum, s) => sum + s.amount, 0),  // Sum of all sale amounts
      totalOrders: sales.length,                                 // Count of sales transactions
      period: `${lastMonth.toLocaleDateString()} - ${lastMonthEnd.toLocaleDateString()}`
    };
  },

  /**
   * Generates sales report for a specific date
   * Useful for daily sales tracking and analysis
   * 
   * @param date - Date string in YYYY-MM-DD format
   * @returns Promise resolving to SalesReport for that date
   */
  getDailySales: async (date: string): Promise<SalesReport> => {
    await delay(300);
    
    // Filter sales for the specific date
    const sales = mockSalesData.filter(s => s.date === date);
    
    return {
      totalSales: sales.reduce((sum, s) => sum + s.amount, 0),
      totalOrders: sales.length,
      period: date
    };
  },

  /**
   * Generates report of top 5 customers by purchase amount
   * Analyzes sales data from the last 3 months
   * Useful for identifying loyal customers and VIP programs
   * 
   * @returns Promise resolving to array of TopCustomer objects
   */
  getTopCustomers: async (): Promise<TopCustomer[]> => {
    await delay(400);
    
    // Calculate date 3 months ago for the analysis period
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Filter sales from the last 3 months
    const recentSales = mockSalesData.filter(s => new Date(s.date) >= threeMonthsAgo);

    // Aggregate sales by customer ID
    // Structure: { customerId: { amount: total spent, count: number of orders } }
    const customerStats: { [key: string]: { amount: number; count: number } } = {};
    
    recentSales.forEach(sale => {
      if (!customerStats[sale.customerId]) {
        customerStats[sale.customerId] = { amount: 0, count: 0 };
      }
      customerStats[sale.customerId].amount += sale.amount;
      customerStats[sale.customerId].count += 1;
    });

    // Convert aggregated data to TopCustomer array
    // Enrich with user details, sort by amount, take top 5
    const topCustomers: TopCustomer[] = Object.entries(customerStats)
      .map(([customerId, stats]) => {
        // Find user details to get their name and email
        const user = users.find(u => u.id === customerId);
        return {
          customerId,
          customerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          email: user?.email || '',
          totalPurchaseAmount: stats.amount,
          orderCount: stats.count
        };
      })
      .sort((a, b) => b.totalPurchaseAmount - a.totalPurchaseAmount)  // Sort descending by amount
      .slice(0, 5);  // Take top 5

    return topCustomers;
  },

  /**
   * Generates report of top 10 selling books by copies sold
   * Analyzes sales data from the last 3 months
   * Useful for inventory planning and marketing decisions
   * 
   * @returns Promise resolving to array of BookSalesReport objects
   */
  getTopSellingBooks: async (): Promise<BookSalesReport[]> => {
    await delay(400);
    
    // Calculate date 3 months ago for the analysis period
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Filter sales from the last 3 months
    const recentSales = mockSalesData.filter(s => new Date(s.date) >= threeMonthsAgo);

    // Aggregate sales by book ISBN
    // Structure: { isbn: { copies: total sold, revenue: total revenue } }
    const bookStats: { [key: string]: { copies: number; revenue: number } } = {};
    
    recentSales.forEach(sale => {
      if (!bookStats[sale.bookIsbn]) {
        bookStats[sale.bookIsbn] = { copies: 0, revenue: 0 };
      }
      bookStats[sale.bookIsbn].copies += sale.quantity;
      bookStats[sale.bookIsbn].revenue += sale.amount;
    });

    // Convert aggregated data to BookSalesReport array
    // Enrich with book details, sort by copies sold, take top 10
    const topBooks: BookSalesReport[] = Object.entries(bookStats)
      .map(([isbn, stats]) => {
        // Find book details to get the title
        const book = books.find(b => b.isbn === isbn);
        return {
          isbn,
          title: book?.title || 'Unknown',
          copiesSold: stats.copies,
          totalRevenue: stats.revenue
        };
      })
      .sort((a, b) => b.copiesSold - a.copiesSold)  // Sort descending by copies sold
      .slice(0, 10);  // Take top 10

    return topBooks;
  },

  /**
   * Generates report of publisher order count for a specific book
   * Shows how many times the bookstore has ordered this book from publishers
   * Useful for analyzing inventory replenishment patterns
   * 
   * @param isbn - ISBN of the book to check
   * @returns Promise resolving to BookOrderCount with order count
   */
  getBookOrderCount: async (isbn: string): Promise<BookOrderCount> => {
    await delay(300);
    
    // Find the book details
    const book = books.find(b => b.isbn === isbn);
    
    // Count publisher orders for this book
    const orderCount = publisherOrders.filter(o => o.bookIsbn === isbn).length;

    return {
      isbn,
      title: book?.title || 'Unknown',
      orderCount
    };
  }
};
