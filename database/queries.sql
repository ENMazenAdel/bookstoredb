-- =============================================
-- BOOKSTORE DATABASE - DDL & SQL QUERIES
-- =============================================
-- 
-- This file contains all DDL (Data Definition Language) commands
-- and corresponding SQL queries for the Bookstore application.
--
-- Sections:
--   1. DDL - Table Creation
--   2. DDL - Constraints
--   3. DDL - Triggers & Functions
--   4. DML - User Queries
--   5. DML - Book Queries
--   6. DML - Cart Queries
--   7. DML - Customer Order Queries
--   8. DML - Publisher Order Queries
--   9. DML - Reports Queries
--
-- =============================================


-- =============================================
-- SECTION 1: DDL - TABLE CREATION
-- =============================================

-- ---------------------------------------------
-- 1.1 USERS TABLE
-- ---------------------------------------------
-- Stores all user accounts (admin and customers)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
6


    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer',
    phone VARCHAR(20),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------
-- 1.2 BOOKS TABLE
-- ---------------------------------------------
-- Master inventory table for all books

CREATE TABLE books (
    isbn VARCHAR(13) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authors TEXT[],
    publisher VARCHAR(100),
    publication_year INT,
    selling_price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    quantity INT DEFAULT 0,
    threshold INT DEFAULT 5,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------
-- 1.3 ORDERS TABLE
-- ---------------------------------------------
-- Customer purchase orders

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------
-- 1.4 ORDER ITEMS TABLE
-- ---------------------------------------------
-- Line items for customer orders

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id),
    book_isbn VARCHAR(13) REFERENCES books(isbn),
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- ---------------------------------------------
-- 1.5 CARTS TABLE
-- ---------------------------------------------
-- Shopping cart header (one per user)

CREATE TABLE carts (
    user_id INT PRIMARY KEY REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------
-- 1.6 CART ITEMS TABLE
-- ---------------------------------------------
-- Items in shopping carts

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(user_id),
    book_isbn VARCHAR(13) REFERENCES books(isbn),
    quantity INT DEFAULT 1
);

-- ---------------------------------------------
-- 1.7 PUBLISHERS TABLE
-- ---------------------------------------------
-- Book publishers/suppliers

CREATE TABLE publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20)
);

-- ---------------------------------------------
-- 1.8 PUBLISHER ORDERS TABLE
-- ---------------------------------------------
-- Stock replenishment orders to publishers

CREATE TABLE publisher_orders (
    id VARCHAR(50) PRIMARY KEY,
    book_isbn VARCHAR(13) REFERENCES books(isbn),
    publisher_id INT REFERENCES publishers(id),
    quantity INT NOT NULL,
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Pending'
);


-- =============================================
-- SECTION 2: DDL - CONSTRAINTS
-- =============================================

-- Prevent negative stock quantities
ALTER TABLE books ADD CONSTRAINT check_quantity_non_negative CHECK (quantity >= 0);


-- =============================================
-- SECTION 3: DDL - TRIGGERS & FUNCTIONS
-- =============================================

-- ---------------------------------------------
-- 3.1 AUTO-REPLENISHMENT TRIGGER
-- ---------------------------------------------
-- Automatically creates publisher order when stock drops below threshold

CREATE OR REPLACE FUNCTION check_stock_threshold() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.quantity >= OLD.threshold AND NEW.quantity < OLD.threshold THEN
        INSERT INTO publisher_orders (id, book_isbn, publisher_id, quantity, status)
        VALUES (
            'PO-' || CAST(extract(epoch from now()) as VARCHAR),
            NEW.isbn,
            (SELECT id FROM publishers WHERE name = NEW.publisher LIMIT 1),
            20,
            'Pending'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_replenish
AFTER UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION check_stock_threshold();

-- ---------------------------------------------
-- 3.2 STOCK UPDATE ON ORDER CONFIRMATION
-- ---------------------------------------------
-- Updates book stock when publisher order is confirmed

CREATE OR REPLACE FUNCTION update_stock_on_confirm() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Confirmed' AND OLD.status != 'Confirmed' THEN
        UPDATE books
        SET quantity = quantity + NEW.quantity
        WHERE isbn = NEW.book_isbn;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_confirm_order
AFTER UPDATE ON publisher_orders
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_confirm();


-- =============================================
-- SECTION 4: DML - USER QUERIES
-- =============================================
-- NOTE: Passwords are stored as SHA-256 hashes with salt
-- JS Equivalent: hashPassword(plainTextPassword) => hashedPassword
-- Hash format: SHA-256(salt + password + salt), where salt = 'bookstore_salt_2024'

-- ---------------------------------------------
-- 4.1 User Authentication (Login)
-- JS Equivalent: 
--   const user = users.find(u => u.username === credentials.username);
--   const storedHash = userPasswords.get(user.id);
--   await verifyPassword(credentials.password, storedHash);
-- ---------------------------------------------
-- Step 1: Get user by username
SELECT * FROM users WHERE username = 'admin';
-- Step 2: Compare hashed password (done in application layer)
-- verifyPassword('admin', stored_hash) => true/false

-- ---------------------------------------------
-- 4.2 Register New User (with hashed password)
-- JS Equivalent: 
--   const hashedPassword = await hashPassword(data.password);
--   users.push(newUser);
--   userPasswords.set(newUser.id, hashedPassword);
-- ---------------------------------------------
-- Password 'password' hashed with SHA-256 + salt
INSERT INTO users (username, password, email, first_name, last_name, role, phone, shipping_address)
VALUES ('john_doe', 'b47e76dba7d04c2e05de954e7e4e3afc66cc5f9f61d3d4f5ab56ea8c1e6f5c68', 'john@example.com', 'John', 'Doe', 'customer', '123-456-7890', '123 Main St');

-- ---------------------------------------------
-- 4.3 Check Username Exists (Before Registration)
-- JS Equivalent: users.some(u => u.username === data.username)
-- ---------------------------------------------
SELECT COUNT(*) FROM users WHERE username = 'john_doe';

-- ---------------------------------------------
-- 4.4 Check Email Exists (Before Registration)
-- JS Equivalent: users.some(u => u.email === data.email)
-- ---------------------------------------------
SELECT COUNT(*) FROM users WHERE email = 'john@example.com';

-- ---------------------------------------------
-- 4.5 Update User Profile
-- JS Equivalent: users[index] = { ...users[index], ...data }
-- ---------------------------------------------
UPDATE users 
SET first_name = 'John', 
    last_name = 'Doe', 
    phone = '123-456-7890', 
    shipping_address = '456 New St'
WHERE id = 1;

-- ---------------------------------------------
-- 4.6 Get User by ID
-- JS Equivalent: users.find(u => u.id === userId)
-- ---------------------------------------------
SELECT * FROM users WHERE id = 1;


-- =============================================
-- SECTION 5: DML - BOOK QUERIES
-- =============================================

-- ---------------------------------------------
-- 5.1 Get All Books
-- JS Equivalent: [...books] or books.slice()
-- ---------------------------------------------
SELECT * FROM books;

-- ---------------------------------------------
-- 5.2 Get Book by ISBN
-- JS Equivalent: books.find(b => b.isbn === isbn)
-- ---------------------------------------------
SELECT * FROM books WHERE isbn = '978-0-13-468599-1';

-- ---------------------------------------------
-- 5.3 Search Books (by title, ISBN, or author)
-- JS Equivalent: books.filter(book => 
--   book.isbn.toLowerCase().includes(query) ||
--   book.title.toLowerCase().includes(query) ||
--   book.authors.some(a => a.toLowerCase().includes(query))
-- )
-- ---------------------------------------------
SELECT * FROM books 
WHERE LOWER(isbn) LIKE LOWER('%search_term%')
   OR LOWER(title) LIKE LOWER('%search_term%')
   OR EXISTS (
       SELECT 1 FROM unnest(authors) AS author 
       WHERE LOWER(author) LIKE LOWER('%search_term%')
   );

-- ---------------------------------------------
-- 5.4 Search Books with Category Filter
-- JS Equivalent: results.filter(b => b.category === filter.category)
-- ---------------------------------------------
SELECT * FROM books 
WHERE category = 'Science'
  AND (LOWER(title) LIKE LOWER('%search_term%') OR LOWER(isbn) LIKE LOWER('%search_term%'));

-- ---------------------------------------------
-- 5.5 Search Books with Publisher Filter
-- JS Equivalent: results.filter(b => b.publisher.toLowerCase().includes(filter.publisher))
-- ---------------------------------------------
SELECT * FROM books 
WHERE LOWER(publisher) LIKE LOWER('%publisher_name%');

-- ---------------------------------------------
-- 5.6 Add New Book
-- JS Equivalent: books.push(newBook)
-- ---------------------------------------------
INSERT INTO books (isbn, title, authors, publisher, publication_year, selling_price, category, quantity, threshold, image_url)
VALUES (
    '978-0-13-468599-1',
    'The Art of Computer Programming',
    ARRAY['Donald Knuth'],
    'Addison-Wesley',
    2011,
    89.99,
    'Science',
    25,
    5,
    'https://example.com/cover.jpg'
);

-- ---------------------------------------------
-- 5.7 Update Book Information
-- JS Equivalent: books[index] = { ...books[index], ...data }
-- ---------------------------------------------
UPDATE books 
SET title = 'Updated Title',
    selling_price = 99.99,
    quantity = 30
WHERE isbn = '978-0-13-468599-1';

-- ---------------------------------------------
-- 5.8 Update Book Quantity (triggers auto-replenish if below threshold)
-- JS Equivalent: books[index].quantity = newQuantity
-- ---------------------------------------------
UPDATE books 
SET quantity = 3
WHERE isbn = '978-0-13-468599-1';

-- ---------------------------------------------
-- 5.9 Delete Book
-- JS Equivalent: books = books.filter(b => b.isbn !== isbn)
-- ---------------------------------------------
DELETE FROM books WHERE isbn = '978-0-13-468599-1';

-- ---------------------------------------------
-- 5.10 Get Books by Category
-- JS Equivalent: books.filter(b => b.category === 'Science')
-- ---------------------------------------------
SELECT * FROM books WHERE category = 'Science';

-- ---------------------------------------------
-- 5.11 Get Low Stock Books (below threshold)
-- JS Equivalent: books.filter(b => b.quantity < b.threshold)
-- ---------------------------------------------
SELECT * FROM books WHERE quantity < threshold;

-- ---------------------------------------------
-- 5.12 Get Books by Publisher
-- JS Equivalent: books.filter(b => b.publisher === 'Addison-Wesley')
-- ---------------------------------------------
SELECT * FROM books WHERE publisher = 'Addison-Wesley';


-- =============================================
-- SECTION 6: DML - CART QUERIES
-- =============================================

-- ---------------------------------------------
-- 6.1 Create Cart for User
-- JS Equivalent: userCarts.set(currentUserId, { items: [], totalItems: 0, totalPrice: 0 })
-- ---------------------------------------------
INSERT INTO carts (user_id) 
VALUES (1)
ON CONFLICT (user_id) DO NOTHING;

-- ---------------------------------------------
-- 6.2 Get User's Cart with Items
-- JS Equivalent: userCarts.get(currentUserId) or getCart()
-- ---------------------------------------------
SELECT c.user_id, ci.book_isbn, ci.quantity, b.title, b.selling_price
FROM carts c
LEFT JOIN cart_items ci ON c.user_id = ci.cart_id
LEFT JOIN books b ON ci.book_isbn = b.isbn
WHERE c.user_id = 1;

-- ---------------------------------------------
-- 6.3 Add Item to Cart
-- JS Equivalent: cart.items.push({ book, quantity }) or existingItem.quantity += quantity
-- ---------------------------------------------
INSERT INTO cart_items (cart_id, book_isbn, quantity)
VALUES (1, '978-0-13-468599-1', 1)
ON CONFLICT (cart_id, book_isbn) 
DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;

-- ---------------------------------------------
-- 6.4 Update Cart Item Quantity
-- JS Equivalent: item.quantity = quantity
-- ---------------------------------------------
UPDATE cart_items 
SET quantity = 3
WHERE cart_id = 1 AND book_isbn = '978-0-13-468599-1';

-- ---------------------------------------------
-- 6.5 Remove Item from Cart
-- JS Equivalent: cart.items = cart.items.filter(item => item.book.isbn !== isbn)
-- ---------------------------------------------
DELETE FROM cart_items 
WHERE cart_id = 1 AND book_isbn = '978-0-13-468599-1';

-- ---------------------------------------------
-- 6.6 Clear Entire Cart
-- JS Equivalent: setCart({ items: [], totalItems: 0, totalPrice: 0 })
-- ---------------------------------------------
DELETE FROM cart_items WHERE cart_id = 1;

-- ---------------------------------------------
-- 6.7 Get Cart Totals
-- JS Equivalent: cart.items.reduce((sum, item) => sum + item.quantity, 0)
--                cart.items.reduce((sum, item) => sum + (item.quantity * item.book.sellingPrice), 0)
-- ---------------------------------------------
SELECT 
    COUNT(*) AS total_items,
    SUM(ci.quantity) AS total_quantity,
    SUM(ci.quantity * b.selling_price) AS total_price
FROM cart_items ci
JOIN books b ON ci.book_isbn = b.isbn
WHERE ci.cart_id = 1;

-- ---------------------------------------------
-- 6.8 Check Stock Availability for Cart Item
-- JS Equivalent: book.quantity >= item.quantity
-- ---------------------------------------------
SELECT b.quantity >= ci.quantity AS is_available
FROM cart_items ci
JOIN books b ON ci.book_isbn = b.isbn
WHERE ci.cart_id = 1 AND ci.book_isbn = '978-0-13-468599-1';


-- =============================================
-- SECTION 7: DML - CUSTOMER ORDER QUERIES
-- =============================================

-- ---------------------------------------------
-- 7.1 Create Customer Order
-- JS Equivalent: customerOrders.push(order)
-- ---------------------------------------------
INSERT INTO orders (id, user_id, status, total_price)
VALUES ('ORD-1703702400000', 1, 'Completed', 129.99);

-- ---------------------------------------------
-- 7.2 Add Order Items
-- JS Equivalent: order.items = cart.items.map(item => ({ isbn, title, quantity, ... }))
-- ---------------------------------------------
INSERT INTO order_items (order_id, book_isbn, quantity, price_at_purchase)
VALUES ('ORD-1703702400000', '978-0-13-468599-1', 2, 89.99);

-- ---------------------------------------------
-- 7.3 Get Orders by Customer
-- JS Equivalent: customerOrders.filter(o => o.customerId === customerId)
-- ---------------------------------------------
SELECT * FROM orders WHERE user_id = 1 ORDER BY created_at DESC;

-- ---------------------------------------------
-- 7.4 Get Order Details with Items
-- JS Equivalent: customerOrders.find(o => o.id === orderId)
-- ---------------------------------------------
SELECT o.*, oi.book_isbn, oi.quantity, oi.price_at_purchase, b.title
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN books b ON oi.book_isbn = b.isbn
WHERE o.id = 'ORD-1703702400000';

-- ---------------------------------------------
-- 7.5 Get Order by ID
-- JS Equivalent: customerOrders.find(o => o.id === orderId)
-- ---------------------------------------------
SELECT * FROM orders WHERE id = 'ORD-1703702400000';

-- ---------------------------------------------
-- 7.6 Update Order Status
-- JS Equivalent: order.status = 'Shipped'
-- ---------------------------------------------
UPDATE orders 
SET status = 'Shipped', updated_at = CURRENT_TIMESTAMP
WHERE id = 'ORD-1703702400000';

-- ---------------------------------------------
-- 7.7 Deduct Stock After Checkout (per item)
-- JS Equivalent: books[bookIndex].quantity -= item.quantity
-- ---------------------------------------------
UPDATE books 
SET quantity = quantity - 2
WHERE isbn = '978-0-13-468599-1';


-- =============================================
-- SECTION 8: DML - PUBLISHER ORDER QUERIES
-- =============================================

-- ---------------------------------------------
-- 8.1 Get All Publisher Orders
-- JS Equivalent: [...publisherOrders]
-- ---------------------------------------------
SELECT * FROM publisher_orders ORDER BY order_date DESC;

-- ---------------------------------------------
-- 8.2 Get Publisher Order by ID
-- JS Equivalent: publisherOrders.find(o => o.id === orderId)
-- ---------------------------------------------
SELECT * FROM publisher_orders WHERE id = 'PO-1703702400000';

-- ---------------------------------------------
-- 8.3 Place Publisher Order (Manual)
-- JS Equivalent: publisherOrders.push(order)
-- ---------------------------------------------
INSERT INTO publisher_orders (id, book_isbn, publisher_id, quantity, status)
VALUES (
    'PO-1703702400000',
    '978-0-13-468599-1',
    (SELECT id FROM publishers WHERE name = 'Addison-Wesley'),
    20,
    'Pending'
);

-- ---------------------------------------------
-- 8.4 Confirm Publisher Order (triggers stock update)
-- JS Equivalent: publisherOrders[orderIndex].status = 'Confirmed'
--                books[bookIndex].quantity += publisherOrders[orderIndex].quantity
-- ---------------------------------------------
UPDATE publisher_orders 
SET status = 'Confirmed'
WHERE id = 'PO-1703702400000';

-- ---------------------------------------------
-- 8.5 Cancel Publisher Order
-- JS Equivalent: publisherOrders[orderIndex].status = 'Cancelled'
-- ---------------------------------------------
UPDATE publisher_orders 
SET status = 'Cancelled'
WHERE id = 'PO-1703702400000';

-- ---------------------------------------------
-- 8.6 Get Pending Publisher Orders
-- JS Equivalent: publisherOrders.filter(o => o.status === 'Pending')
-- ---------------------------------------------
SELECT * FROM publisher_orders WHERE status = 'Pending';

-- ---------------------------------------------
-- 8.7 Get Publisher Orders by Book ISBN
-- JS Equivalent: publisherOrders.filter(o => o.bookIsbn === isbn)
-- ---------------------------------------------
SELECT * FROM publisher_orders WHERE book_isbn = '978-0-13-468599-1';

-- ---------------------------------------------
-- 8.8 Get Publisher Orders with Book Details
-- JS Equivalent: publisherOrders.map(po => ({ ...po, book: books.find(b => b.isbn === po.bookIsbn) }))
-- ---------------------------------------------
SELECT po.*, b.title, b.quantity AS current_stock, p.name AS publisher_name
FROM publisher_orders po
JOIN books b ON po.book_isbn = b.isbn
JOIN publishers p ON po.publisher_id = p.id
ORDER BY po.order_date DESC;


-- =============================================
-- SECTION 9: DML - REPORTS QUERIES
-- =============================================

-- ---------------------------------------------
-- 9.1 Get All Publishers
-- JS Equivalent: [...publishers]
-- ---------------------------------------------
SELECT * FROM publishers;

-- ---------------------------------------------
-- 9.2 Monthly Sales Report (Previous Month)
-- JS Equivalent: mockSalesData.filter(s => saleDate >= lastMonth && saleDate <= lastMonthEnd)
--                sales.reduce((sum, s) => sum + s.amount, 0)
-- ---------------------------------------------
SELECT 
    COUNT(*) AS total_orders,
    SUM(total_price) AS total_sales,
    DATE_TRUNC('month', created_at) AS month
FROM orders
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND created_at < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY DATE_TRUNC('month', created_at);

-- ---------------------------------------------
-- 9.3 Daily Sales Report
-- JS Equivalent: mockSalesData.filter(s => s.date === date)
-- ---------------------------------------------
SELECT 
    COUNT(*) AS total_orders,
    SUM(total_price) AS total_sales
FROM orders
WHERE DATE(created_at) = '2024-12-26';

-- ---------------------------------------------
-- 9.4 Top 5 Customers by Purchase Amount (Last 3 Months)
-- JS Equivalent: customers.sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 5)
-- ---------------------------------------------
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    SUM(o.total_price) AS total_purchases,
    COUNT(o.id) AS order_count
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY u.id, u.username, u.first_name, u.last_name
ORDER BY total_purchases DESC
LIMIT 5;

-- ---------------------------------------------
-- 9.5 Top 10 Selling Books (Last 3 Months)
-- JS Equivalent: bookSales.sort((a, b) => b.copiesSold - a.copiesSold).slice(0, 10)
-- ---------------------------------------------
SELECT 
    b.isbn,
    b.title,
    b.authors,
    SUM(oi.quantity) AS copies_sold,
    SUM(oi.quantity * oi.price_at_purchase) AS total_revenue
FROM books b
JOIN order_items oi ON b.isbn = oi.book_isbn
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY b.isbn, b.title, b.authors
ORDER BY copies_sold DESC
LIMIT 10;

-- ---------------------------------------------
-- 9.6 Sales by Category
-- JS Equivalent: Object.groupBy(sales, item => item.category)
-- ---------------------------------------------
SELECT 
    b.category,
    SUM(oi.quantity) AS books_sold,
    SUM(oi.quantity * oi.price_at_purchase) AS revenue
FROM books b
JOIN order_items oi ON b.isbn = oi.book_isbn
GROUP BY b.category
ORDER BY revenue DESC;

-- ---------------------------------------------
-- 9.7 Publisher Order Count by Book
-- JS Equivalent: publisherOrders.filter(po => po.bookIsbn === isbn).length
-- ---------------------------------------------
SELECT 
    b.isbn,
    b.title,
    COUNT(po.id) AS order_count,
    SUM(CASE WHEN po.status = 'Confirmed' THEN po.quantity ELSE 0 END) AS confirmed_quantity
FROM books b
LEFT JOIN publisher_orders po ON b.isbn = po.book_isbn
GROUP BY b.isbn, b.title
ORDER BY order_count DESC;

-- ---------------------------------------------
-- 9.8 Inventory Status Report
-- JS Equivalent: books.map(b => ({ ...b, status: b.quantity === 0 ? 'Out of Stock' : b.quantity < b.threshold ? 'Low Stock' : 'In Stock' }))
-- ---------------------------------------------
SELECT 
    isbn,
    title,
    quantity,
    threshold,
    CASE 
        WHEN quantity = 0 THEN 'Out of Stock'
        WHEN quantity < threshold THEN 'Low Stock'
        ELSE 'In Stock'
    END AS stock_status
FROM books
ORDER BY quantity ASC;

-- ---------------------------------------------
-- 9.9 Revenue by Month (Last 12 Months)
-- JS Equivalent: Object.groupBy(orders, o => o.createdAt.getMonth())
-- ---------------------------------------------
SELECT 
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS order_count,
    SUM(total_price) AS monthly_revenue
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- ---------------------------------------------
-- 9.10 Average Order Value
-- JS Equivalent: orders.reduce((sum, o) => sum + o.totalPrice, 0) / orders.length
-- ---------------------------------------------
SELECT 
    AVG(total_price) AS average_order_value,
    MIN(total_price) AS min_order,
    MAX(total_price) AS max_order
FROM orders;
