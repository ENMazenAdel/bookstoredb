# 📚 Bookstore - Online Book Shopping System

A full-stack online bookstore application with a React + TypeScript frontend and Express.js backend API.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat&logo=bootstrap)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat&logo=express)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Demo Credentials](#-demo-credentials)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Business Rules](#-business-rules)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## ✨ Features

### 👤 For Customers
- 🔍 Browse and search books by title, ISBN, author, category, or publisher
- 📖 View book details and availability
- 🛒 Add books to shopping cart
- 💳 Checkout with credit card payment
- 📜 View order history
- ⚙️ Manage profile information

### 👨‍💼 For Administrators
- 📊 Dashboard with sales overview and alerts
- ➕ Add, edit, and delete books
- 📦 Update book quantities (record sales)
- 📝 Place orders with publishers when stock is low
- ✅ Confirm orders and update inventory
- 📈 Generate reports:
  - Monthly sales report
  - Daily sales report
  - Top 5 customers (last 3 months)
  - Top 10 selling books (last 3 months)
  - Book order count from publishers

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Bootstrap 5 | Styling |
| React Router v6 | Navigation |
| React Icons | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| CORS | Cross-Origin Support |

### Database
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Database (Schema) |
| In-Memory | Development Storage |

---

## 📁 Project Structure

```
bookstoredb/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── BookCard.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/        # React context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Login, Register
│   │   │   ├── admin/      # Dashboard, BookManagement, Orders, Reports
│   │   │   └── customer/   # Home, BrowseBooks, Cart, Profile, OrderHistory
│   │   ├── services/       # API service layer
│   │   │   ├── api.ts      # Mock API functions
│   │   │   └── mockData.ts # Sample data
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx         # Main app with routing
│   └── package.json
│
├── backend/                # Express.js API server
│   ├── src/
│   │   ├── index.js        # Server entry point
│   │   └── routes/
│   │       ├── books.js    # Book CRUD endpoints
│   │       ├── users.js    # Auth & user endpoints
│   │       ├── cart.js     # Cart operations
│   │       └── orders.js   # Order management
│   └── package.json
│
├── database/               # Database files
│   ├── schema.sql          # PostgreSQL schema with triggers
│   ├── books.json          # Sample book data
│   ├── users.json          # Sample user data
│   ├── publishers.json     # Sample publisher data
│   └── publisher_orders.json
│
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookstoredb
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on http://localhost:5173

---

## 🔐 Demo Credentials

| Role | Username | Password |
|:----:|:--------:|:--------:|
| 👨‍💼 Admin | `admin` | `admin` |
| 👤 Customer | `john_doe` | `password` |

---

## 🔌 API Endpoints

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:isbn` | Get book by ISBN |
| POST | `/api/books` | Create new book |
| PUT | `/api/books/:isbn` | Update book |
| DELETE | `/api/books/:isbn` | Delete book |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/login` | User login |
| POST | `/api/users/register` | User registration |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update profile |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/:userId` | Get user's cart |
| POST | `/api/cart/:userId/items` | Add to cart |
| PUT | `/api/cart/:userId/items/:isbn` | Update quantity |
| DELETE | `/api/cart/:userId/items/:isbn` | Remove item |
| DELETE | `/api/cart/:userId` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/user/:userId` | Get user's orders |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id` | Update order |

---

## 🗄 Database Schema

### Tables
- **users** - User accounts and profiles
- **books** - Book inventory
- **orders** - Customer orders
- **order_items** - Order line items
- **carts** - Shopping cart headers
- **cart_items** - Cart contents
- **publishers** - Book publishers
- **publisher_orders** - Stock replenishment orders

### Triggers
1. **Auto-Replenishment**: When stock drops below threshold, automatically creates publisher order
2. **Stock Update**: When publisher order is confirmed, stock is automatically updated

### Book Categories
| Category | Color |
|----------|-------|
| 🔬 Science | Blue |
| 🎨 Art | Amber |
| ⛪ Religion | Violet |
| 📜 History | Red |
| 🌍 Geography | Fuchsia |

---

## 📜 Business Rules

1. **Stock Management**: Quantity cannot go negative
2. **Auto-Ordering**: When stock drops below threshold, an order is automatically placed with the publisher (20 copies)
3. **Order Confirmation**: When admin confirms an order, the stock is automatically updated
4. **Cart on Logout**: Shopping cart is cleared when customer logs out
5. **Role-Based Access**: Admins and customers have different accessible pages

---

## 📝 Available Scripts

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend
| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (auto-reload) |

---

## 📄 License

This project is for educational purposes.

---

<div align="center">

**Made with ❤️ using React & Express**

</div>
