-- Bookstore Database Schema

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Should be hashed
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer', -- 'admin', 'customer', 'manager'
    phone VARCHAR(20),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE books (
    isbn VARCHAR(13) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authors TEXT[], -- Array of authors
    publisher VARCHAR(100),
    publication_year INT,
    selling_price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    quantity INT DEFAULT 0,
    threshold INT DEFAULT 5,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'shipped', 'delivered', 'cancelled'
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id),
    book_isbn VARCHAR(13) REFERENCES books(isbn),
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Cart Table (Optional, usually Redis or similar, but for SQL)
CREATE TABLE carts (
    user_id INT PRIMARY KEY REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items Table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(user_id),
    book_isbn VARCHAR(13) REFERENCES books(isbn),
    quantity INT DEFAULT 1
);

-- Publishers Table
CREATE TABLE publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20)
);

-- Publisher Orders Table (for replenishing stock)
CREATE TABLE publisher_orders (
    id VARCHAR(50) PRIMARY KEY,
    book_isbn VARCHAR(13) REFERENCES books(isbn),
    publisher_id INT REFERENCES publishers(id), -- In a real DB, this would be a FK
    quantity INT NOT NULL,
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Pending' -- 'Pending', 'Confirmed', 'Cancelled'
);

-- =============================================
-- CONSTRAINTS & TRIGGERS
-- =============================================

-- 1. Prevent negative stock
ALTER TABLE books ADD CONSTRAINT check_quantity_non_negative CHECK (quantity >= 0);

-- 2. Trigger Function: Auto-place order when stock drops below threshold
-- Note: This is PostgreSQL syntax
CREATE OR REPLACE FUNCTION check_stock_threshold() RETURNS TRIGGER AS $$
BEGIN
    -- If old quantity was >= threshold AND new quantity < threshold
    IF OLD.quantity >= OLD.threshold AND NEW.quantity < OLD.threshold THEN
        INSERT INTO publisher_orders (id, book_isbn, publisher_id, quantity, status)
        VALUES (
            'PO-' || CAST(extract(epoch from now()) as VARCHAR), -- Generate simple ID
            NEW.isbn,
            (SELECT id FROM publishers WHERE name = NEW.publisher LIMIT 1), -- Simplification for schema
            20, -- Fixed quantity as per requirements
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

-- 3. Trigger Function: Update stock on order confirmation
CREATE OR REPLACE FUNCTION update_stock_on_confirm() RETURNS TRIGGER AS $$
BEGIN
    -- If status changes to 'Confirmed'
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
