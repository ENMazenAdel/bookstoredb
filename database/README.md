# Database Documentation

This folder contains the database schema and sample data for the Bookstore application.

## Files Overview

### schema.sql
PostgreSQL database schema including:
- **Tables**: users, books, orders, order_items, carts, cart_items, publishers, publisher_orders
- **Constraints**: Non-negative stock quantity check
- **Triggers**: 
  - Auto-replenishment when stock drops below threshold
  - Stock update when publisher order is confirmed

### JSON Data Files
Sample data files for development and testing. These mirror the schema structure.

---

## Data Files Documentation

### books.json
```
Sample inventory of 10 books across 5 categories.

Fields:
- isbn (string): ISBN-13 identifier - Primary Key
- title (string): Book title
- authors (string[]): Array of author names
- publisher (string): Publisher name
- publicationYear (number): Year of publication
- sellingPrice (number): Retail price in USD
- category (string): One of 'Science', 'Art', 'History', 'Religion', 'Geography'
- quantity (number): Current copies in stock
- threshold (number): Minimum stock level before auto-reorder
- imageUrl (string): URL to book cover image

Sample Categories:
- Science: 3 books (Computer Programming, Algorithms, Popular Science)
- Art: 2 books (Literature, Art History)
- History: 2 books (European History, Human History)
- Religion: 2 books (Theology, World Religions)
- Geography: 1 book (Physical Geography)
```

### users.json
```
Sample user accounts for testing.

Fields:
- id (string): Unique user identifier
- username (string): Login username
- password (string): Plain text password (for demo only!)
- email (string): User email address
- firstName (string): User's first name
- lastName (string): User's last name
- role (string): 'admin' or 'customer'
- phone (string, optional): Contact phone number
- shippingAddress (string, optional): Default shipping address

Sample Users:
- admin/admin: Administrator account
- john_doe/password: Sample customer account
```

### publishers.json
```
Sample publisher/supplier records.

Fields:
- id (string): Unique publisher identifier
- name (string): Publisher company name
- address (string): Business address
- phone (string): Contact phone number

Sample Publishers (10 total):
- Addison-Wesley, HarperCollins, W.W. Norton, Wiley, Knopf
- Broadway Books, Phaidon Press, Harper, Oxford University Press, MIT Press
```

### publisher_orders.json
```
Sample stock replenishment orders to publishers.

Fields:
- id (string): Order ID format 'PO-XXX'
- bookIsbn (string): ISBN of book being ordered
- bookTitle (string): Title of book (denormalized)
- publisher (string): Publisher name
- quantity (number): Number of copies ordered
- orderDate (string): Date order was placed (YYYY-MM-DD)
- status (string): 'Pending', 'Confirmed', or 'Cancelled'

Order Lifecycle:
1. Pending - Order created (manually or by auto-trigger)
2. Confirmed - Admin confirms, stock is added to inventory
3. Cancelled - Order cancelled, no stock change

Sample Orders:
- PO-001: Introduction to Algorithms (20 copies, Pending)
- PO-002: Physical Geography (15 copies, Confirmed)
- PO-003: The Art of Computer Programming (10 copies, Confirmed)
```

---

## Entity Relationships

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   orders    │       │ order_items │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │──────<│ id (PK)     │──────<│ id (PK)     │
│ username    │       │ user_id(FK) │       │ order_id(FK)│
│ password    │       │ status      │       │ book_isbn   │>──┐
│ email       │       │ total_price │       │ quantity    │   │
│ role        │       │ created_at  │       │ price_at    │   │
└─────────────┘       └─────────────┘       └─────────────┘   │
                                                              │
┌─────────────┐       ┌─────────────┐       ┌─────────────┐   │
│   carts     │       │ cart_items  │       │   books     │<──┘
│─────────────│       │─────────────│       │─────────────│
│ user_id(PK) │──────<│ id (PK)     │      >│ isbn (PK)   │
│ updated_at  │       │ cart_id(FK) │──────/│ title       │
└─────────────┘       │ book_isbn   │       │ authors     │
                      │ quantity    │       │ quantity    │
                      └─────────────┘       │ threshold   │
                                            └─────────────┘
                                                  │
┌─────────────┐       ┌─────────────────┐         │
│ publishers  │       │ publisher_orders│         │
│─────────────│       │─────────────────│         │
│ id (PK)     │──────<│ id (PK)         │         │
│ name        │       │ book_isbn (FK)  │>────────┘
│ address     │       │ publisher_id(FK)│
│ phone       │       │ quantity        │
└─────────────┘       │ status          │
                      └─────────────────┘
```

---

## Database Triggers

### 1. Auto-Replenishment Trigger
**Trigger**: `trigger_auto_replenish`
**Function**: `check_stock_threshold()`
**Table**: `books`
**Event**: AFTER UPDATE

**Purpose**: Automatically creates a publisher order when a book's stock drops below its threshold.

**Logic**:
```sql
IF OLD.quantity >= OLD.threshold AND NEW.quantity < OLD.threshold THEN
    INSERT INTO publisher_orders (quantity = 20, status = 'Pending')
END IF
```

### 2. Stock Update on Confirmation
**Trigger**: `trigger_confirm_order`
**Function**: `update_stock_on_confirm()`
**Table**: `publisher_orders`
**Event**: AFTER UPDATE

**Purpose**: Adds ordered quantity to book stock when a publisher order is confirmed.

**Logic**:
```sql
IF NEW.status = 'Confirmed' AND OLD.status != 'Confirmed' THEN
    UPDATE books SET quantity = quantity + NEW.quantity
END IF
```

---

## Sample Queries

### Get all books low on stock
```sql
SELECT isbn, title, quantity, threshold 
FROM books 
WHERE quantity < threshold;
```

### Get pending publisher orders
```sql
SELECT po.*, b.title 
FROM publisher_orders po
JOIN books b ON po.book_isbn = b.isbn
WHERE po.status = 'Pending';
```

### Get customer order history
```sql
SELECT o.*, u.username 
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.id = ?
ORDER BY o.created_at DESC;
```

### Get top selling books
```sql
SELECT b.title, SUM(oi.quantity) as total_sold
FROM order_items oi
JOIN books b ON oi.book_isbn = b.isbn
GROUP BY b.isbn
ORDER BY total_sold DESC
LIMIT 10;
```
