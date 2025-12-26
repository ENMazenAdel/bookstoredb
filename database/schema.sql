-- =============================================
-- BOOKSTORE DATABASE SCHEMA
-- =============================================
-- 
-- This SQL schema defines the complete database structure for the
-- online bookstore system. Designed for PostgreSQL.
--
-- DATABASE OVERVIEW:
-- -----------------
-- The schema supports the following functionality:
--   1. User management with role-based access (admin/customer)
--   2. Book inventory with automatic stock tracking
--   3. Customer orders with order items
--   4. Shopping cart persistence
--   5. Publisher management for stock replenishment
--   6. Automatic low-stock order placement via triggers
--
-- RELATIONSHIPS:
-- -------------
-- users (1) ----< orders (many)
-- orders (1) ----< order_items (many)
-- books (1) ----< order_items (many)
-- users (1) ----< carts (1)
-- carts (1) ----< cart_items (many)
-- publishers (1) ----< publisher_orders (many)
-- books (1) ----< publisher_orders (many)
--
-- TRIGGERS:
-- --------
-- 1. check_stock_threshold - Auto-creates publisher order when stock drops
-- 2. update_stock_on_confirm - Adds stock when publisher order confirmed
--
-- =============================================

-- =============================================
-- USERS TABLE
-- =============================================
-- Stores all user accounts for the bookstore system.
-- Supports both admin users (store managers) and customers.

CREATE TABLE users (
    -- Primary key: Auto-incrementing unique identifier
    id SERIAL PRIMARY KEY,
    
    -- Login credentials (username must be unique)
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Should be hashed with bcrypt in production
    
    -- Contact information
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    
    -- Role-based access control: 'admin', 'customer', or 'manager'
    role VARCHAR(20) DEFAULT 'customer',
    
    -- Optional customer information
    phone VARCHAR(20),
    shipping_address TEXT,
    
    -- Audit timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- BOOKS TABLE
-- =============================================
-- Master inventory table for all books in the store.
-- ISBN is used as primary key (natural key).

CREATE TABLE books (
    -- Primary key: ISBN-13 format (e.g., '978-0-13-468599-1')
    isbn VARCHAR(13) PRIMARY KEY,
    
    -- Book metadata
    title VARCHAR(255) NOT NULL,
    authors TEXT[], -- PostgreSQL array type for multiple authors
    publisher VARCHAR(100),
    publication_year INT,
    
    -- Pricing
    selling_price DECIMAL(10, 2) NOT NULL,
    
    -- Classification: 'Science', 'Art', 'Religion', 'History', 'Geography'
    category VARCHAR(50),
    
    -- Inventory management
    quantity INT DEFAULT 0,      -- Current stock level
    threshold INT DEFAULT 5,     -- Minimum stock before auto-reorder trigger
    
    -- Book cover image URL
    image_url TEXT,
    
    -- Audit timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ORDERS TABLE
-- =============================================
-- Customer purchase orders (different from publisher orders).
-- Links to users table for customer information.

CREATE TABLE orders (
    -- Primary key: Order ID format 'ORD-{timestamp}'
    id VARCHAR(50) PRIMARY KEY,
    
    -- Foreign key to users table
    user_id INT REFERENCES users(id),
    
    -- Order lifecycle: 'pending' -> 'shipped' -> 'delivered' (or 'cancelled')
    status VARCHAR(20) DEFAULT 'pending',
    
    -- Order total (sum of all items)
    total_price DECIMAL(10, 2),
    
    -- Audit timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
-- Line items for customer orders.
-- Junction table between orders and books with quantity info.

CREATE TABLE order_items (
    -- Surrogate primary key
    id SERIAL PRIMARY KEY,
    
    -- Foreign key to orders table
    order_id VARCHAR(50) REFERENCES orders(id),
    
    -- Foreign key to books table
    book_isbn VARCHAR(13) REFERENCES books(isbn),
    
    -- Quantity ordered
    quantity INT NOT NULL,
    
    -- Price snapshot at time of purchase (in case book price changes later)
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- =============================================
-- CART TABLE
-- =============================================
-- Shopping cart header record for customers.
-- One cart per user (1:1 relationship with users).
-- Note: In production, often implemented with Redis for performance.

CREATE TABLE carts (
    -- Primary key: Same as user_id (1:1 relationship)
    user_id INT PRIMARY KEY REFERENCES users(id),
    
    -- Last modification timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CART ITEMS TABLE
-- =============================================
-- Items currently in a customer's shopping cart.
-- Cleared after successful checkout.

CREATE TABLE cart_items (
    -- Surrogate primary key
    id SERIAL PRIMARY KEY,
    
    -- Foreign key to carts table (via user_id)
    cart_id INT REFERENCES carts(user_id),
    
    -- Foreign key to books table
    book_isbn VARCHAR(13) REFERENCES books(isbn),
    
    -- Quantity in cart (default 1)
    quantity INT DEFAULT 1
);

-- =============================================
-- PUBLISHERS TABLE
-- =============================================
-- Book publishers/suppliers for inventory replenishment.
-- Used for placing stock orders.

CREATE TABLE publishers (
    -- Auto-incrementing primary key
    id SERIAL PRIMARY KEY,
    
    -- Publisher information
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20)
);

-- =============================================
-- PUBLISHER ORDERS TABLE
-- =============================================
-- Stock replenishment orders placed with publishers.
-- Different from customer orders - these are B2B orders TO suppliers.
-- Can be created manually by admin or automatically by stock trigger.

CREATE TABLE publisher_orders (
    -- Primary key: Format 'PO-{timestamp}'
    id VARCHAR(50) PRIMARY KEY,
    
    -- Foreign key to books table - which book to order
    book_isbn VARCHAR(13) REFERENCES books(isbn),
    
    -- Foreign key to publishers table - who to order from
    publisher_id INT REFERENCES publishers(id),
    
    -- Quantity to order (typically 20 for auto-orders per requirements)
    quantity INT NOT NULL,
    
    -- Date order was placed
    order_date DATE DEFAULT CURRENT_DATE,
    
    -- Order status: 'Pending' -> 'Confirmed' (stock added) or 'Cancelled'
    status VARCHAR(20) DEFAULT 'Pending'
);

-- =============================================
-- CONSTRAINTS
-- =============================================

-- Prevent negative stock quantities
-- This ensures quantity can never go below 0
ALTER TABLE books ADD CONSTRAINT check_quantity_non_negative CHECK (quantity >= 0);

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

-- ---------------------------------------------
-- TRIGGER 1: Auto-Replenishment on Low Stock
-- ---------------------------------------------
-- When a book's quantity drops below its threshold,
-- automatically create a publisher order for 20 copies.
-- This fulfills the requirement for automatic stock management.

/**
 * Trigger Function: check_stock_threshold
 * 
 * Monitors book quantity changes and creates automatic publisher orders
 * when stock falls below the defined threshold.
 * 
 * Trigger Condition:
 *   - OLD quantity >= threshold (was above threshold)
 *   - NEW quantity < threshold (now below threshold)
 * 
 * Action:
 *   Creates a publisher order for 20 copies with 'Pending' status
 */
CREATE OR REPLACE FUNCTION check_stock_threshold() RETURNS TRIGGER AS $$
BEGIN
    -- Check if stock just dropped below threshold
    IF OLD.quantity >= OLD.threshold AND NEW.quantity < OLD.threshold THEN
        -- Insert automatic publisher order
        INSERT INTO publisher_orders (id, book_isbn, publisher_id, quantity, status)
        VALUES (
            'PO-' || CAST(extract(epoch from now()) as VARCHAR), -- Generate unique ID
            NEW.isbn,                                              -- Book being ordered
            (SELECT id FROM publishers WHERE name = NEW.publisher LIMIT 1), -- Match publisher
            20,                                                    -- Fixed quantity per requirements
            'Pending'                                              -- Initial status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to books table (fires AFTER UPDATE)
CREATE TRIGGER trigger_auto_replenish
AFTER UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION check_stock_threshold();

-- ---------------------------------------------
-- TRIGGER 2: Update Stock on Order Confirmation
-- ---------------------------------------------
-- When a publisher order status changes to 'Confirmed',
-- automatically add the ordered quantity to the book's stock.

/**
 * Trigger Function: update_stock_on_confirm
 * 
 * Updates book inventory when a publisher order is confirmed.
 * This completes the replenishment cycle.
 * 
 * Trigger Condition:
 *   - NEW status = 'Confirmed'
 *   - OLD status != 'Confirmed' (prevents double-counting)
 * 
 * Action:
 *   Adds the order quantity to the book's current stock
 */
CREATE OR REPLACE FUNCTION update_stock_on_confirm() RETURNS TRIGGER AS $$
BEGIN
    -- Check if status just changed to 'Confirmed'
    IF NEW.status = 'Confirmed' AND OLD.status != 'Confirmed' THEN
        -- Add ordered quantity to book stock
        UPDATE books
        SET quantity = quantity + NEW.quantity
        WHERE isbn = NEW.book_isbn;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to publisher_orders table (fires AFTER UPDATE)
CREATE TRIGGER trigger_confirm_order
AFTER UPDATE ON publisher_orders
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_confirm();
