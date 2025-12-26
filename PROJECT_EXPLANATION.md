# Complete Project Explanation: Online Bookstore System

## 📋 Project Overview

This is a **full-stack online bookstore system** built with React + TypeScript frontend. It simulates a real-world bookstore with inventory management, customer shopping, and automated stock replenishment.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Pages     │  │  Components │  │      Context        │ │
│  │  - Admin    │  │  - Navbar   │  │  - AuthContext      │ │
│  │  - Customer │  │  - BookCard │  │  - CartContext      │ │
│  │  - Auth     │  │  - Footer   │  │                     │ │
│  └──────┬──────┘  └─────────────┘  └──────────┬──────────┘ │
│         │                                      │            │
│         └──────────────┬───────────────────────┘            │
│                        ▼                                    │
│              ┌─────────────────┐                           │
│              │   Services/API  │  (Mock API simulating     │
│              │   - booksApi    │   database operations)    │
│              │   - ordersApi   │                           │
│              │   - cartApi     │                           │
│              │   - reportsApi  │                           │
│              └────────┬────────┘                           │
└───────────────────────┼─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Users   │ │  Books   │ │Publishers│ │ Orders/Carts  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
│                                                             │
│  Triggers: Auto-replenish, Confirm-stock-update            │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles & Permissions

### **Administrator**
| Feature | Description |
|---------|-------------|
| Book Management | Add, edit, delete books; manage stock and thresholds |
| Order Management | View/confirm/cancel publisher replenishment orders |
| Reports | Access sales analytics, top customers, top books |
| Dashboard | Overview of system metrics |

### **Customer**
| Feature | Description |
|---------|-------------|
| Browse & Search | View catalog, filter by category, search by title/author |
| Shopping Cart | Add items, update quantities, remove items |
| Checkout | Process payment (simulated), place orders |
| Order History | View past purchases |
| Profile | View and edit personal information |

---

## 📁 Project Structure Explained

```
bookstoredb/
├── frontend/                    # React Application
│   ├── src/
│   │   ├── App.tsx             # Main app with routing
│   │   ├── main.tsx            # Entry point
│   │   │
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx      # Navigation bar (role-aware)
│   │   │   ├── BookCard.tsx    # Book display card
│   │   │   ├── Footer.tsx      # Page footer
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProtectedRoute.tsx  # Auth guard for routes
│   │   │
│   │   ├── context/            # Global state management
│   │   │   ├── AuthContext.tsx # User authentication state
│   │   │   └── CartContext.tsx # Shopping cart state
│   │   │
│   │   ├── pages/              # Page components
│   │   │   ├── admin/          # Admin-only pages
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── BookManagement.tsx
│   │   │   │   ├── OrderManagement.tsx
│   │   │   │   └── Reports.tsx
│   │   │   │
│   │   │   ├── auth/           # Authentication pages
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   │
│   │   │   └── customer/       # Customer pages
│   │   │       ├── Home.tsx
│   │   │       ├── BrowseBooks.tsx
│   │   │       ├── Cart.tsx
│   │   │       ├── OrderHistory.tsx
│   │   │       ├── Profile.tsx
│   │   │       └── EditProfile.tsx
│   │   │
│   │   ├── services/           # API layer
│   │   │   ├── api.ts          # All API functions
│   │   │   └── mockData.ts     # Sample data
│   │   │
│   │   └── types/              # TypeScript interfaces
│   │       ├── Book.ts
│   │       ├── User.ts
│   │       ├── Order.ts
│   │       ├── Cart.ts
│   │       └── Reports.ts
│   │
│   └── package.json
│
├── database/                    # Database files
│   ├── schema.sql              # SQL table definitions + triggers
│   ├── books.json              # Sample books data
│   ├── users.json              # Sample users
│   ├── publishers.json         # Publishers list
│   └── publisher_orders.json   # Replenishment orders
│
└── backend/                     # Express.js server (optional)
    └── src/
        ├── index.js
        └── routes/
```

---

## 🔄 Core Workflows

### 1. Customer Purchase Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Browse  │───▶│  Add to │───▶│  View   │───▶│Checkout │───▶│  Order  │
│  Books  │    │  Cart   │    │  Cart   │    │ Payment │    │ Created │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └────┬────┘
                                                                  │
                                                                  ▼
                                                          ┌─────────────┐
                                                          │Stock Reduced│
                                                          └─────────────┘
```

**Code Flow:**
1. `BrowseBooks.tsx` → calls `booksApi.getAll()` → displays books
2. Click "Add to Cart" → `CartContext.addToCart()` → `cartApi.addItem()`
3. `Cart.tsx` → shows items → user fills payment form
4. Click "Checkout" → `cartApi.checkout()` → validates card → creates order → deducts stock

### 2. Auto-Replenishment Flow (Trigger)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Stock drops │───▶│   Trigger   │───▶│  Publisher  │───▶│   Admin     │
│ below       │    │   fires     │    │   Order     │    │  confirms   │
│ threshold   │    │ (auto)      │    │  (Pending)  │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                 │
                                                                 ▼
                                                         ┌─────────────┐
                                                         │Stock Updated│
                                                         │  (Trigger)  │
                                                         └─────────────┘
```

**Example:** Book has `quantity: 8`, `threshold: 5`
- Customer buys 4 copies → `quantity` becomes 4
- Since 4 < 5 (threshold), trigger fires
- Creates `publisher_orders` record with `quantity: 20`, `status: 'Pending'`
- Admin confirms → second trigger fires → `quantity` becomes 24

---

## 🗃️ Database Design

### Entity Relationships

| Parent | Child | Relationship | Meaning |
|--------|-------|--------------|---------|
| USERS | ORDERS | 1:N | One user places many orders |
| USERS | CARTS | 1:1 | Each user has one cart |
| BOOKS | ORDER_ITEMS | 1:N | One book in many order items |
| BOOKS | CART_ITEMS | 1:N | One book in many carts |
| BOOKS | PUBLISHER_ORDERS | 1:N | One book has many restock orders |
| ORDERS | ORDER_ITEMS | 1:N | One order has many items |
| PUBLISHERS | BOOKS | 1:N | One publisher publishes many books |

### Key Constraints

```sql
-- Prevents negative stock
CHECK (quantity >= 0)

-- Ensures unique users
UNIQUE (username)
UNIQUE (email)

-- Referential integrity
FOREIGN KEY (user_id) REFERENCES users(id)
FOREIGN KEY (book_isbn) REFERENCES books(isbn)
```

### Database Triggers

**Trigger 1: Auto-Replenish**
```
WHEN: Book quantity updated AND new_quantity < threshold
THEN: INSERT new publisher order for 20 units
```

**Trigger 2: Confirm Stock**
```
WHEN: Publisher order status changes to 'Confirmed'
THEN: ADD order quantity to book stock
```

---

## 🖥️ Key Pages Explained

### Admin Dashboard
- **Stats Cards**: Total books, monthly sales, pending orders, low stock count
- **Quick Actions**: Links to management pages
- **Alerts**: Shows books below threshold needing attention

### Book Management
- **Table View**: All books with ISBN, title, price, stock, threshold
- **Actions**: Add new, edit, delete, quick stock adjustment (+/-)
- **Search/Filter**: Find books by name, ISBN, or category

### Reports
| Report | Data Source | Calculation |
|--------|-------------|-------------|
| Monthly Sales | Sales transactions | Sum of last month's amounts |
| Daily Sales | Sales transactions | Filter by selected date |
| Top 5 Customers | Sales + Users | Group by customer, sum amounts, top 5 |
| Top 10 Books | Sales + Books | Group by ISBN, count copies sold, top 10 |

### Customer Cart
- **Items List**: Book thumbnail, title, price, quantity controls
- **Totals**: Real-time calculation of subtotal
- **Checkout Form**: Credit card number (>13 digits), expiry, CVV
- **Validation**: Checks stock availability before completing

---

## 🔐 Authentication System

```tsx
// AuthContext provides:
{
  user: User | null,        // Current logged-in user
  isAuthenticated: boolean, // Quick auth check
  login: (credentials) => Promise<User>,
  register: (data) => Promise<User>,
  logout: () => void
}
```

**Login Flow:**
1. User enters credentials
2. `authApi.login()` validates against users list
3. On success: stores user in localStorage + context
4. `ProtectedRoute` component checks auth before rendering pages

**Role-Based Access:**
```tsx
// In routes
<Route path="/admin/*" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 🛒 Cart System

```tsx
// CartContext provides:
{
  cart: Cart,               // { items, totalItems, totalPrice }
  addToCart: (isbn) => void,
  updateQuantity: (isbn, qty) => void,
  removeFromCart: (isbn) => void,
  checkout: (paymentData) => Promise<Order>
}
```

**Key Features:**
- **User-specific**: Each user has their own cart (stored by userId)
- **Stock validation**: Can't add more than available stock
- **Persistent**: Survives page refresh via localStorage
- **Real-time totals**: Recalculates on every change

---

## 📊 Sample Data Summary

| Entity | Count | Purpose |
|--------|-------|---------|
| Books | 10 | 2 per category (Science, Art, History, Religion, Geography) |
| Publishers | 10 | One per book publisher |
| Users | 3 | 1 admin + 2 customers |
| Customer Orders | 3 | Demo order history |
| Publisher Orders | 3 | Demo replenishment workflow |
| Sales Transactions | 10+ | Generate meaningful reports |

---

## 🚀 How to Run

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:5173
```

### Test Accounts
| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin` | Administrator |
| `john_doe` | `password` | Customer |
| `jane_smith` | `password` | Customer |

---

## ✅ Requirements Checklist

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Integrity constraints | ✅ | CHECK, UNIQUE, FOREIGN KEY, NOT NULL |
| Database triggers | ✅ | Auto-replenish + Confirm-stock triggers |
| Sufficient sample data | ✅ | 10 books, 3 users, orders, sales data |
| Implemented features | ✅ | Full CRUD, cart, checkout, reports |
| ERD diagram | ✅ | Mermaid diagram in report |
| Relational schema | ✅ | All tables documented |
| UI screen descriptions | ✅ | Logic for all 12+ screens |

---

## 📝 File Summary

| File | Purpose |
|------|---------|
| `PROJECT_REPORT.md` | Formal project report with ERD, schema, UI descriptions |
| `PROJECT_EXPLANATION.md` | This file - detailed technical explanation |
| `README.md` | Quick start guide |
| `database/schema.sql` | SQL definitions with triggers |

---

This project demonstrates a complete **Order Processing System** with proper database design, business logic automation via triggers, and a full-featured user interface for both administrators and customers.
