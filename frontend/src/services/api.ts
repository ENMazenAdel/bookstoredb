import {
  Book,
  BookFormData,
  Publisher,
  PublisherOrder,
  User,
  LoginCredentials,
  RegisterData,
  CustomerOrder,
  Cart,
  CheckoutData,
  SalesReport,
  BookSalesReport,
  TopCustomer,
  BookOrderCount
} from '../types';
import {
  mockBooks,
  mockPublishers,
  mockPublisherOrders,
  mockUsers,
  mockCustomerOrders,
  mockSalesData
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data stores
let books = [...mockBooks];
let publishers = [...mockPublishers];
let publisherOrders = [...mockPublisherOrders];
let users = [...mockUsers];
let customerOrders = [...mockCustomerOrders];

// User-specific carts (userId -> Cart)
const userCarts = new Map<string, Cart>();
let currentUserId: string | null = null;

// Initialize currentUserId from localStorage if user is already logged in
const initializeUser = () => {
  const storedUser = localStorage.getItem('bookstore_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      currentUserId = user.id;
    } catch {
      // Invalid stored user, will be cleared by AuthContext
    }
  }
};
initializeUser();

const getCart = (): Cart => {
  if (!currentUserId) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }
  if (!userCarts.has(currentUserId)) {
    userCarts.set(currentUserId, { items: [], totalItems: 0, totalPrice: 0 });
  }
  return userCarts.get(currentUserId)!;
};

const setCart = (cart: Cart): void => {
  if (currentUserId) {
    userCarts.set(currentUserId, cart);
  }
};

// ============ Authentication API ============
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(500);
    // For demo: admin/admin or any username with password "password"
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const adminUser = users.find(u => u.role === 'admin')!;
      currentUserId = adminUser.id;
      return adminUser;
    }
    const user = users.find(u => u.username === credentials.username);
    if (user && credentials.password === 'password') {
      currentUserId = user.id;
      return user;
    }
    throw new Error('Invalid username or password');
  },

  register: async (data: RegisterData): Promise<User> => {
    await delay(500);
    if (users.some(u => u.username === data.username)) {
      throw new Error('Username already exists');
    }
    if (users.some(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }
    const newUser: User = {
      id: `cust-${Date.now()}`,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      shippingAddress: data.shippingAddress,
      role: 'customer'
    };
    users.push(newUser);
    currentUserId = newUser.id;
    return newUser;
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await delay(300);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...data };
    return users[index];
  },

  logout: async (): Promise<void> => {
    await delay(200);
    currentUserId = null;
  }
};

// ============ Books API ============
export const booksApi = {
  getAll: async (): Promise<Book[]> => {
    await delay(300);
    return [...books];
  },

  getByIsbn: async (isbn: string): Promise<Book | undefined> => {
    await delay(200);
    return books.find(b => b.isbn === isbn);
  },

  search: async (query: string, filter?: { category?: string; author?: string; publisher?: string }): Promise<Book[]> => {
    await delay(300);
    let results = books.filter(book =>
      book.isbn.toLowerCase().includes(query.toLowerCase()) ||
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.authors.some(a => a.toLowerCase().includes(query.toLowerCase()))
    );

    if (filter?.category) {
      results = results.filter(b => b.category === filter.category);
    }
    if (filter?.author) {
      results = results.filter(b => b.authors.some(a => a.toLowerCase().includes(filter.author!.toLowerCase())));
    }
    if (filter?.publisher) {
      results = results.filter(b => b.publisher.toLowerCase().includes(filter.publisher!.toLowerCase()));
    }

    return results;
  },

  add: async (data: BookFormData): Promise<Book> => {
    await delay(400);
    if (books.some(b => b.isbn === data.isbn)) {
      throw new Error('Book with this ISBN already exists');
    }
    const newBook: Book = {
      ...data,
      authors: data.authors.split(',').map(a => a.trim()),
      imageUrl: `https://via.placeholder.com/150x200?text=${encodeURIComponent(data.title.substring(0, 10))}`
    };
    books.push(newBook);
    return newBook;
  },

  update: async (isbn: string, data: Partial<Book>): Promise<Book> => {
    await delay(300);
    const index = books.findIndex(b => b.isbn === isbn);
    if (index === -1) throw new Error('Book not found');

    // Trigger: Cannot update if quantity would go negative
    if (data.quantity !== undefined && data.quantity < 0) {
      throw new Error('Book quantity cannot be negative');
    }

    const oldQuantity = books[index].quantity;
    books[index] = { ...books[index], ...data };

    // Trigger: Auto-place order when quantity drops below threshold
    if (data.quantity !== undefined && oldQuantity >= books[index].threshold && data.quantity < books[index].threshold) {
      const autoOrder: PublisherOrder = {
        id: `PO-${Date.now()}`,
        bookIsbn: isbn,
        bookTitle: books[index].title,
        publisher: books[index].publisher,
        quantity: 20, // Constant order quantity
        orderDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      publisherOrders.push(autoOrder);
      console.log('Auto-order placed:', autoOrder);
    }

    return books[index];
  },

  delete: async (isbn: string): Promise<void> => {
    await delay(300);
    books = books.filter(b => b.isbn !== isbn);
  }
};

// ============ Publishers API ============
export const publishersApi = {
  getAll: async (): Promise<Publisher[]> => {
    await delay(200);
    return [...publishers];
  }
};

// ============ Publisher Orders API ============
export const ordersApi = {
  getAll: async (): Promise<PublisherOrder[]> => {
    await delay(300);
    return [...publisherOrders];
  },

  place: async (bookIsbn: string, quantity: number = 20): Promise<PublisherOrder> => {
    await delay(400);
    const book = books.find(b => b.isbn === bookIsbn);
    if (!book) throw new Error('Book not found');

    const order: PublisherOrder = {
      id: `PO-${Date.now()}`,
      bookIsbn,
      bookTitle: book.title,
      publisher: book.publisher,
      quantity,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    publisherOrders.push(order);
    return order;
  },

  confirm: async (orderId: string): Promise<PublisherOrder> => {
    await delay(400);
    const orderIndex = publisherOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');
    if (publisherOrders[orderIndex].status !== 'Pending') {
      throw new Error('Order is not pending');
    }

    // Update order status
    publisherOrders[orderIndex].status = 'Confirmed';

    // Add quantity to book stock
    const bookIndex = books.findIndex(b => b.isbn === publisherOrders[orderIndex].bookIsbn);
    if (bookIndex !== -1) {
      books[bookIndex].quantity += publisherOrders[orderIndex].quantity;
    }

    return publisherOrders[orderIndex];
  },

  cancel: async (orderId: string): Promise<PublisherOrder> => {
    await delay(300);
    const orderIndex = publisherOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');
    publisherOrders[orderIndex].status = 'Cancelled';
    return publisherOrders[orderIndex];
  }
};

// ============ Cart API ============
export const cartApi = {
  get: async (): Promise<Cart> => {
    await delay(100);
    return { ...getCart() };
  },

  addItem: async (isbn: string, quantity: number = 1): Promise<Cart> => {
    await delay(200);
    const book = books.find(b => b.isbn === isbn);
    if (!book) throw new Error('Book not found');
    if (book.quantity < quantity) throw new Error('Not enough stock available');

    const cart = getCart();
    const existingItem = cart.items.find(item => item.book.isbn === isbn);
    if (existingItem) {
      if (existingItem.quantity + quantity > book.quantity) {
        throw new Error('Not enough stock available');
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ book, quantity });
    }

    recalculateCart(cart);
    setCart(cart);
    return { ...cart };
  },

  updateQuantity: async (isbn: string, quantity: number): Promise<Cart> => {
    await delay(200);
    if (quantity <= 0) {
      return cartApi.removeItem(isbn);
    }

    const cart = getCart();
    const item = cart.items.find(i => i.book.isbn === isbn);
    if (!item) throw new Error('Item not in cart');

    const book = books.find(b => b.isbn === isbn);
    if (!book || book.quantity < quantity) throw new Error('Not enough stock available');

    item.quantity = quantity;
    recalculateCart(cart);
    setCart(cart);
    return { ...cart };
  },

  removeItem: async (isbn: string): Promise<Cart> => {
    await delay(200);
    const cart = getCart();
    cart.items = cart.items.filter(item => item.book.isbn !== isbn);
    recalculateCart(cart);
    setCart(cart);
    return { ...cart };
  },

  clear: async (): Promise<Cart> => {
    await delay(100);
    const emptyCart = { items: [], totalItems: 0, totalPrice: 0 };
    setCart(emptyCart);
    return { ...emptyCart };
  },

  checkout: async (checkoutData: CheckoutData, _userId: string): Promise<CustomerOrder> => {
    await delay(800);

    // Validate credit card (simple validation for demo)
    if (!checkoutData.creditCardNumber || checkoutData.creditCardNumber.length < 13) {
      throw new Error('Invalid credit card number');
    }
    if (!checkoutData.expiryDate || !/^\d{2}\/\d{2}$/.test(checkoutData.expiryDate)) {
      throw new Error('Invalid expiry date format (MM/YY)');
    }

    const cart = getCart();
    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Validate stock before checkout
    for (const item of cart.items) {
      const book = books.find(b => b.isbn === item.book.isbn);
      if (!book || book.quantity < item.quantity) {
        throw new Error(`Not enough stock for "${item.book.title}". Available: ${book?.quantity || 0}`);
      }
    }

    // Create order
    const order: CustomerOrder = {
      id: `ORD-${Date.now()}`,
      customerId: _userId, // Associate order with user
      orderDate: new Date().toISOString().split('T')[0],
      items: cart.items.map(item => ({
        isbn: item.book.isbn,
        title: item.book.title,
        quantity: item.quantity,
        pricePerUnit: item.book.sellingPrice,
        totalPrice: item.quantity * item.book.sellingPrice
      })),
      totalAmount: cart.totalPrice,
      status: 'Completed'
    };

    // Deduct quantities from stock
    for (const item of cart.items) {
      const bookIndex = books.findIndex(b => b.isbn === item.book.isbn);
      if (bookIndex !== -1) {
        const oldQuantity = books[bookIndex].quantity;
        books[bookIndex].quantity -= item.quantity;

        // Trigger: Auto-place order when quantity drops below threshold
        if (oldQuantity >= books[bookIndex].threshold && books[bookIndex].quantity < books[bookIndex].threshold) {
          const autoOrder: PublisherOrder = {
            id: `PO-${Date.now()}-${item.book.isbn}`,
            bookIsbn: item.book.isbn,
            bookTitle: books[bookIndex].title,
            publisher: books[bookIndex].publisher,
            quantity: 20,
            orderDate: new Date().toISOString().split('T')[0],
            status: 'Pending'
          };
          publisherOrders.push(autoOrder);
        }
      }
    }

    // Add to customer orders
    customerOrders.push(order);

    // Clear cart
    setCart({ items: [], totalItems: 0, totalPrice: 0 });

    return order;
  }
};

function recalculateCart(cart: Cart) {
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.book.sellingPrice), 0);
}

// ============ Customer Orders API ============
export const customerOrdersApi = {
  getByCustomer: async (customerId: string): Promise<CustomerOrder[]> => {
    await delay(300);
    return customerOrders.filter(o => o.customerId === customerId);
  },

  getById: async (orderId: string): Promise<CustomerOrder | undefined> => {
    await delay(200);
    return customerOrders.find(o => o.id === orderId);
  }
};

// ============ Reports API ============
export const reportsApi = {
  getMonthlySales: async (): Promise<SalesReport> => {
    await delay(400);
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const sales = mockSalesData.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= lastMonth && saleDate <= lastMonthEnd;
    });

    return {
      totalSales: sales.reduce((sum, s) => sum + s.amount, 0),
      totalOrders: sales.length,
      period: `${lastMonth.toLocaleDateString()} - ${lastMonthEnd.toLocaleDateString()}`
    };
  },

  getDailySales: async (date: string): Promise<SalesReport> => {
    await delay(300);
    const sales = mockSalesData.filter(s => s.date === date);
    return {
      totalSales: sales.reduce((sum, s) => sum + s.amount, 0),
      totalOrders: sales.length,
      period: date
    };
  },

  getTopCustomers: async (): Promise<TopCustomer[]> => {
    await delay(400);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentSales = mockSalesData.filter(s => new Date(s.date) >= threeMonthsAgo);

    const customerStats: { [key: string]: { amount: number; count: number } } = {};
    recentSales.forEach(sale => {
      if (!customerStats[sale.customerId]) {
        customerStats[sale.customerId] = { amount: 0, count: 0 };
      }
      customerStats[sale.customerId].amount += sale.amount;
      customerStats[sale.customerId].count += 1;
    });

    const topCustomers: TopCustomer[] = Object.entries(customerStats)
      .map(([customerId, stats]) => {
        const user = users.find(u => u.id === customerId);
        return {
          customerId,
          customerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          email: user?.email || '',
          totalPurchaseAmount: stats.amount,
          orderCount: stats.count
        };
      })
      .sort((a, b) => b.totalPurchaseAmount - a.totalPurchaseAmount)
      .slice(0, 5);

    return topCustomers;
  },

  getTopSellingBooks: async (): Promise<BookSalesReport[]> => {
    await delay(400);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentSales = mockSalesData.filter(s => new Date(s.date) >= threeMonthsAgo);

    const bookStats: { [key: string]: { copies: number; revenue: number } } = {};
    recentSales.forEach(sale => {
      if (!bookStats[sale.bookIsbn]) {
        bookStats[sale.bookIsbn] = { copies: 0, revenue: 0 };
      }
      bookStats[sale.bookIsbn].copies += sale.quantity;
      bookStats[sale.bookIsbn].revenue += sale.amount;
    });

    const topBooks: BookSalesReport[] = Object.entries(bookStats)
      .map(([isbn, stats]) => {
        const book = books.find(b => b.isbn === isbn);
        return {
          isbn,
          title: book?.title || 'Unknown',
          copiesSold: stats.copies,
          totalRevenue: stats.revenue
        };
      })
      .sort((a, b) => b.copiesSold - a.copiesSold)
      .slice(0, 10);

    return topBooks;
  },

  getBookOrderCount: async (isbn: string): Promise<BookOrderCount> => {
    await delay(300);
    const book = books.find(b => b.isbn === isbn);
    const orderCount = publisherOrders.filter(o => o.bookIsbn === isbn).length;

    return {
      isbn,
      title: book?.title || 'Unknown',
      orderCount
    };
  }
};
