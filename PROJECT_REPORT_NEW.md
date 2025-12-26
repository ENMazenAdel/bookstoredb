# Project Report: Order Processing System (Bookstore)

**Course:** Database Systems  
**Program:** Computer and Communications (Fall 2025)

---

## 1. Group Members
1.  Mazen adel           - 8634
2.  Mazen Bassem         - 9021
3.  Ahmed Mahrous        - 8974
4.  Abdelrahman Mahgoub  - 9041
---

## 2. Implemented Features

We have successfully implemented a comprehensive online bookstore system that supports two user roles: **Administrators** and **Customers**. The system demonstrates full database functionality with integrity constraints, triggers, and sufficient sample data.

### 2.1 Administrator Features (Part 1)

#### Book Management
- **Add New Books**: Admins can add books with complete details including ISBN, title, authors, publisher, publication year, selling price, category, initial quantity, and minimum stock threshold.
- **Update Existing Books**: Modify any book attribute including stock levels and threshold values.
- **Delete Books**: Remove books from the inventory.
- **Search & Filter**: Search books by ISBN, title, or author. Filter by category (Science, Art, Religion, History, Geography).

#### Stock Management & Automated Triggers
- **Threshold-Based Auto-Replenishment**: When book stock drops below its defined threshold, the system automatically generates a publisher order for 20 units.
- **Non-Negative Stock Constraint**: Database constraint (`CHECK (quantity >= 0)`) prevents stock from going negative.
- **Stock Update on Order Confirmation**: When a publisher order status changes to "Confirmed", the book quantity is automatically increased by the order amount.

#### Publisher Order Management
- **View All Orders**: See all publisher replenishment orders with status filtering (Pending, Confirmed, Cancelled).
- **Place Manual Orders**: Admins can manually place orders for any book with custom quantities.
- **Confirm Orders**: Confirm receipt of goods, which triggers automatic stock increase.
- **Cancel Orders**: Cancel pending orders if needed.

#### Reporting System
- **Monthly Sales Report**: Total sales amount and order count for the previous month.
- **Daily Sales Report**: Sales data for any specific date.
- **Top 5 Customers**: Customers ranked by total purchase amount over the last 3 months.
- **Top 10 Selling Books**: Books ranked by copies sold over the last 3 months.
- **Publisher Order History**: Track replenishment orders by book ISBN.

### 2.2 Customer Features (Part 2)

#### User Authentication
- **Registration**: New customers can create accounts with username, password, email, name, phone, and shipping address. Validates for unique username and email.
- **Login/Logout**: Secure session management with role-based redirection (admins → dashboard, customers → home).

#### Profile Management
- **View Profile**: Display all personal information.
- **Edit Profile**: Update first name, last name, email, phone, shipping address, and password.

#### Book Browsing
- **Browse Catalog**: View all available books in grid or list layout.
- **Advanced Search**: Search by ISBN, title, or author name.
- **Category Filtering**: Filter by Science, Art, Religion, History, or Geography.
- **Publisher/Author Filtering**: Additional filters for specific publishers or authors.
- **Sorting Options**: Sort by title, price (ascending/descending), or publication year.

#### Shopping Cart
- **Add to Cart**: Add books with availability validation (checks stock).
- **Update Quantities**: Increase or decrease item quantities with stock validation.
- **Remove Items**: Remove individual items from cart.
- **Real-time Totals**: Automatic calculation of item count and total price.
- **User-Specific Carts**: Each logged-in user has their own persistent cart.

#### Checkout Process
- **Credit Card Validation**: Simulates payment processing with card number, expiry date, and CVV validation.
- **Order Creation**: Generates order record with unique ID, items, and total amount.
- **Inventory Deduction**: Immediately reduces book stock upon successful checkout.
- **Cart Clearance**: Empties cart after successful order.

#### Order History
- **View Past Orders**: List all completed orders with dates, item counts, and totals.
- **Order Details**: Expand any order to see individual items with ISBN, title, quantity, unit price, and line totals.
- **Status Tracking**: View order status (Completed, Processing, Cancelled).

---

## 3. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o| CARTS : has
    USERS {
        int id PK
        varchar username UK
        varchar password
        varchar email UK
        varchar first_name
        varchar last_name
        varchar role
        varchar phone
        text shipping_address
        timestamp created_at
    }
    
    PUBLISHERS ||--o{ BOOKS : publishes
    PUBLISHERS ||--o{ PUBLISHER_ORDERS : receives
    PUBLISHERS {
        int id PK
        varchar name
        text address
        varchar phone
    }

    BOOKS ||--o{ ORDER_ITEMS : contains
    BOOKS ||--o{ CART_ITEMS : added_to
    BOOKS ||--o{ PUBLISHER_ORDERS : restocks
    BOOKS {
        varchar isbn PK
        varchar title
        text authors
        varchar publisher FK
        int publication_year
        decimal selling_price
        varchar category
        int quantity
        int threshold
        text image_url
        timestamp created_at
    }

    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDERS {
        varchar id PK
        int user_id FK
        varchar status
        decimal total_price
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEMS {
        int id PK
        varchar order_id FK
        varchar book_isbn FK
        int quantity
        decimal price_at_purchase
    }

    CARTS ||--|{ CART_ITEMS : contains
    CARTS {
        int user_id PK_FK
        timestamp updated_at
    }

    CART_ITEMS {
        int id PK
        int cart_id FK
        varchar book_isbn FK
        int quantity
    }

    PUBLISHER_ORDERS {
        varchar id PK
        varchar book_isbn FK
        int publisher_id FK
        int quantity
        date order_date
        varchar status
    }
```

### ERD Relationships Explained

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| USERS → ORDERS | 1:N | One user can place many orders |
| USERS → CARTS | 1:1 | Each user has exactly one cart |
| PUBLISHERS → BOOKS | 1:N | One publisher can publish many books |
| PUBLISHERS → PUBLISHER_ORDERS | 1:N | One publisher receives many replenishment orders |
| BOOKS → ORDER_ITEMS | 1:N | One book can appear in many order items |
| BOOKS → CART_ITEMS | 1:N | One book can be in many user carts |
| BOOKS → PUBLISHER_ORDERS | 1:N | One book can have many replenishment orders |
| ORDERS → ORDER_ITEMS | 1:N | One order contains multiple items |
| CARTS → CART_ITEMS | 1:N | One cart contains multiple items |

---

## 4. Relational Schema

The database schema implements all entities with proper constraints, relationships, and triggers for data integrity.

### 4.1 Table Definitions

#### Users Table
```
USERS (
    id: SERIAL PRIMARY KEY,
    username: VARCHAR(50) UNIQUE NOT NULL,
    password: VARCHAR(255) NOT NULL,
    email: VARCHAR(100) UNIQUE NOT NULL,
    first_name: VARCHAR(50),
    last_name: VARCHAR(50),
    role: VARCHAR(20) DEFAULT 'customer',
    phone: VARCHAR(20),
    shipping_address: TEXT,
    created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Books Table
```
BOOKS (
    isbn: VARCHAR(13) PRIMARY KEY,
    title: VARCHAR(255) NOT NULL,
    authors: TEXT[],
    publisher: VARCHAR(100),
    publication_year: INT,
    selling_price: DECIMAL(10,2) NOT NULL,
    category: VARCHAR(50),
    quantity: INT DEFAULT 0 CHECK (quantity >= 0),
    threshold: INT DEFAULT 5,
    image_url: TEXT,
    created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Publishers Table
```
PUBLISHERS (
    id: SERIAL PRIMARY KEY,
    name: VARCHAR(100) NOT NULL,
    address: TEXT,
    phone: VARCHAR(20)
)
```

#### Orders Table (Customer Orders)
```
ORDERS (
    id: VARCHAR(50) PRIMARY KEY,
    user_id: INT REFERENCES users(id),
    status: VARCHAR(20) DEFAULT 'pending',
    total_price: DECIMAL(10,2),
    created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Order Items Table
```
ORDER_ITEMS (
    id: SERIAL PRIMARY KEY,
    order_id: VARCHAR(50) REFERENCES orders(id),
    book_isbn: VARCHAR(13) REFERENCES books(isbn),
    quantity: INT NOT NULL,
    price_at_purchase: DECIMAL(10,2) NOT NULL
)
```

#### Carts Table
```
CARTS (
    user_id: INT PRIMARY KEY REFERENCES users(id),
    updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Cart Items Table
```
CART_ITEMS (
    id: SERIAL PRIMARY KEY,
    cart_id: INT REFERENCES carts(user_id),
    book_isbn: VARCHAR(13) REFERENCES books(isbn),
    quantity: INT DEFAULT 1
)
```

#### Publisher Orders Table (Replenishment)
```
PUBLISHER_ORDERS (
    id: VARCHAR(50) PRIMARY KEY,
    book_isbn: VARCHAR(13) REFERENCES books(isbn),
    publisher_id: INT REFERENCES publishers(id),
    quantity: INT NOT NULL,
    order_date: DATE DEFAULT CURRENT_DATE,
    status: VARCHAR(20) DEFAULT 'Pending'
)
```

### 4.2 Integrity Constraints

| Constraint Type | Table | Description |
|----------------|-------|-------------|
| PRIMARY KEY | All tables | Unique identifier for each record |
| FOREIGN KEY | orders.user_id | References users(id) |
| FOREIGN KEY | order_items.order_id | References orders(id) |
| FOREIGN KEY | order_items.book_isbn | References books(isbn) |
| FOREIGN KEY | cart_items.cart_id | References carts(user_id) |
| FOREIGN KEY | cart_items.book_isbn | References books(isbn) |
| FOREIGN KEY | publisher_orders.book_isbn | References books(isbn) |
| FOREIGN KEY | publisher_orders.publisher_id | References publishers(id) |
| UNIQUE | users.username | No duplicate usernames |
| UNIQUE | users.email | No duplicate emails |
| CHECK | books.quantity | quantity >= 0 (non-negative stock) |
| NOT NULL | Critical fields | Ensures required data is provided |

### 4.3 Database Triggers

#### Trigger 1: Auto-Replenish Stock
```sql
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
```
**Purpose**: Automatically places a replenishment order when book stock falls below threshold.

#### Trigger 2: Update Stock on Order Confirmation
```sql
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
```
**Purpose**: Automatically increases book stock when a publisher order is confirmed.

---

## 5. Sample Data

The system is populated with sufficient sample data to demonstrate all features:

### 5.1 Books (10 items across 5 categories)

| ISBN | Title | Category | Price | Stock | Threshold |
|------|-------|----------|-------|-------|-----------|
| 978-0-13-468599-1 | The Art of Computer Programming | Science | $89.99 | 25 | 5 |
| 978-0-06-112008-4 | To Kill a Mockingbird | Art | $14.99 | 50 | 10 |
| 978-0-19-953556-8 | A History of Modern Europe | History | $65.00 | 15 | 3 |
| 978-0-07-352332-7 | Physical Geography | Geography | $120.00 | 8 | 5 |
| 978-0-06-093546-7 | The Case for God | Religion | $27.95 | 30 | 7 |
| 978-1-59448-273-9 | A Short History of Nearly Everything | Science | $18.00 | 40 | 8 |
| 978-0-14-028329-7 | The Story of Art | Art | $39.95 | 22 | 5 |
| 978-0-06-083865-2 | Sapiens: A Brief History of Humankind | History | $24.99 | 60 | 12 |
| 978-0-19-280722-2 | World Religions | Religion | $22.50 | 18 | 4 |
| 978-0-321-12521-7 | Introduction to Algorithms | Science | $95.00 | 3 | 5 |

### 5.2 Publishers (10 publishers)

| ID | Name | Location |
|----|------|----------|
| 1 | Addison-Wesley | Boston, MA |
| 2 | HarperCollins | New York, NY |
| 3 | W.W. Norton | New York, NY |
| 4 | Wiley | Hoboken, NJ |
| 5 | Knopf | New York, NY |
| 6 | Broadway Books | New York, NY |
| 7 | Phaidon Press | New York, NY |
| 8 | Harper | New York, NY |
| 9 | Oxford University Press | New York, NY |
| 10 | MIT Press | Cambridge, MA |

### 5.3 Users (3 users)

| Username | Role | Email |
|----------|------|-------|
| admin | Administrator | admin@bookstore.com |
| john_doe | Customer | john@example.com |
| jane_smith | Customer | jane@example.com |

### 5.4 Customer Orders (3 orders)

| Order ID | Customer | Date | Items | Total |
|----------|----------|------|-------|-------|
| ORD-001 | john_doe | 2025-12-01 | 2 books | $64.97 |
| ORD-002 | john_doe | 2025-11-28 | 1 book | $95.00 |
| ORD-003 | jane_smith | 2025-11-15 | 2 books | $84.95 |

### 5.5 Publisher Orders (3 orders)

| Order ID | Book | Publisher | Quantity | Status |
|----------|------|-----------|----------|--------|
| PO-001 | Introduction to Algorithms | MIT Press | 20 | Pending |
| PO-002 | Physical Geography | Wiley | 15 | Confirmed |
| PO-003 | The Art of Computer Programming | Addison-Wesley | 10 | Confirmed |

### 5.6 Sales Data (10+ transactions for reports)

Sample sales transactions spanning October-December 2025 for generating meaningful reports on monthly/daily sales, top customers, and top-selling books.

---

## 6. User Interface Screens Description

### 6.1 Authentication Screens

#### Login Page (`/login`)
- **Purpose**: Authenticate existing users
- **Components**: Username input, password input, login button, register link
- **Logic**: 
  - Validates credentials against users table
  - On success: Stores user session in localStorage, redirects admin to `/admin/dashboard`, customers to home
  - On failure: Displays error message
- **Demo Credentials**: `admin/admin` for admin, `john_doe/password` for customer

#### Registration Page (`/register`)
- **Purpose**: Create new customer accounts
- **Components**: Form with username, email, password, confirm password, first/last name, phone, shipping address
- **Logic**:
  - Validates password match and minimum length (6 chars)
  - Checks for unique username and email
  - Creates new user record, logs in automatically
  - Redirects to home page

### 6.2 Customer Screens

#### Home Page (`/`)
- **Purpose**: Landing page with featured content
- **Components**: Hero banner, navigation to browse books
- **Logic**: Displays welcome message, links to book catalog

#### Browse Books (`/books`)
- **Purpose**: View and search book catalog
- **Components**: 
  - Search bar (searches title, ISBN, author)
  - Category sidebar filter
  - Author/Publisher dropdown filters
  - Sort options (title, price asc/desc, year)
  - Grid/List view toggle
  - Book cards with Add to Cart button
- **Logic**:
  - Fetches all books from API
  - Applies filters/search client-side for responsive UX
  - Add to Cart validates login status and stock availability

#### Shopping Cart (`/cart`)
- **Purpose**: Manage items before checkout
- **Components**:
  - Item list with thumbnails, titles, prices
  - Quantity +/- buttons
  - Remove item button
  - Running total display
  - Checkout button → Checkout form
- **Logic**:
  - Quantity changes validate against available stock
  - Real-time total recalculation
  - Checkout form collects credit card info
  - Payment validation (card length > 13 digits)
  - On success: Creates order, deducts stock, clears cart

#### Order History (`/orders`)
- **Purpose**: View past purchases
- **Components**:
  - Order list with ID, date, item count, total, status
  - Order detail panel showing individual items
- **Logic**:
  - Fetches orders by logged-in customer ID
  - Displays items with ISBN, title, quantity, unit price, line total

#### Profile (`/profile`)
- **Purpose**: View personal information
- **Components**: Display of all user fields, Edit Profile button
- **Logic**: Shows current user data from context

#### Edit Profile (`/profile/edit`)
- **Purpose**: Update personal information
- **Components**: Form with all editable fields including password
- **Logic**:
  - Pre-fills form with current data
  - Empty password field = no password change
  - Updates user record on submit
  - Redirects to profile on success

### 6.3 Administrator Screens

#### Dashboard (`/admin/dashboard`)
- **Purpose**: Overview of system status
- **Components**:
  - Stats cards: Total Books, Monthly Sales, Pending Orders, Low Stock Alerts
  - Quick links to management pages
  - Low stock books list
  - Recent pending orders
- **Logic**:
  - Aggregates data from books, orders, and sales APIs
  - Low stock = books where quantity < threshold

#### Book Management (`/admin/books`)
- **Purpose**: Full CRUD operations on book inventory
- **Components**:
  - Search bar and category filter
  - Books table with all details
  - Add New Book button → Modal form
  - Edit/Delete buttons per row
  - Quick quantity +/- buttons
- **Logic**:
  - Add: Validates unique ISBN, creates new book
  - Edit: Opens modal with pre-filled data
  - Delete: Confirmation dialog, removes book
  - Quantity change triggers auto-replenish if below threshold

#### Order Management (`/admin/orders`)
- **Purpose**: Manage publisher replenishment orders
- **Components**:
  - Status filter dropdown
  - Place New Order button → Modal with book selector
  - Orders table with book, publisher, quantity, date, status
  - Confirm/Cancel action buttons
- **Logic**:
  - Place Order: Creates new publisher order with default quantity 20
  - Confirm: Updates status, triggers stock increase
  - Cancel: Updates status to Cancelled

#### Reports (`/admin/reports`)
- **Purpose**: View business analytics
- **Components**:
  - Tab navigation: Monthly Sales, Daily Sales, Top Customers, Top Books, Publisher Orders
  - Date picker for daily sales
  - Book selector for order count
  - Data tables/cards for each report
- **Logic**:
  - Monthly Sales: Aggregates previous month's transactions
  - Daily Sales: Filters by selected date
  - Top 5 Customers: Ranks by purchase amount (last 3 months)
  - Top 10 Books: Ranks by copies sold (last 3 months)
  - Publisher Orders: Counts orders per book

---

## 7. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Bootstrap 5 + Custom CSS |
| Routing | React Router v6 |
| State Management | React Context API |
| Icons | React Icons (Font Awesome) |
| Backend | Node.js (Express) / Mock API |
| Database | PostgreSQL (Schema) / In-Memory Mock |

---

## 8. How to Run

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Demo Accounts
| Username | Password | Role |
|----------|----------|------|
| admin | admin | Administrator |
| john_doe | password | Customer |
| jane_smith | password | Customer |

---

## 9. Conclusion

This bookstore order processing system successfully implements all required features including:
- ✅ Complete book management with CRUD operations
- ✅ Automated inventory replenishment via database triggers
- ✅ Customer shopping cart and checkout workflow
- ✅ Order history and profile management
- ✅ Comprehensive reporting for business analytics
- ✅ Role-based access control (Admin/Customer)
- ✅ All integrity constraints preserved (unique keys, foreign keys, check constraints)
- ✅ Sufficient sample data for complete system demonstration
