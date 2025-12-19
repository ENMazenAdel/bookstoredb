# Bookstore - Online Book Shopping System

A React + TypeScript frontend for an online bookstore system with Bootstrap 5 styling.

## Features

### For Customers
- Browse and search books by title, ISBN, author, category, or publisher
- View book details and availability
- Add books to shopping cart
- Checkout with credit card payment
- View order history
- Manage profile information

### For Administrators
- Dashboard with sales overview and alerts
- Add, edit, and delete books
- Update book quantities (record sales)
- Place orders with publishers when stock is low
- Confirm orders and update inventory
- Generate reports:
  - Monthly sales report
  - Daily sales report
  - Top 5 customers (last 3 months)
  - Top 10 selling books (last 3 months)
  - Book order count from publishers

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Bootstrap 5** for UI components
- **React Router v6** for navigation
- **React Icons** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin |
| Customer | john_doe | password |

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── BookCard.tsx
│   ├── LoadingSpinner.tsx
│   └── ProtectedRoute.tsx
├── context/            # React context providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── pages/              # Page components
│   ├── auth/           # Login, Register
│   ├── admin/          # Admin pages
│   └── customer/       # Customer pages
├── services/           # API service layer
│   ├── api.ts          # Mock API functions
│   └── mockData.ts     # Sample data
├── types/              # TypeScript interfaces
└── App.tsx             # Main app with routing
```

## Book Categories

- Science
- Art
- Religion
- History
- Geography

## Business Rules (Simulated)

1. **Stock Management**: Quantity cannot go negative
2. **Auto-Ordering**: When stock drops below threshold, an order is automatically placed with the publisher
3. **Order Confirmation**: When admin confirms an order, the stock is automatically updated
4. **Cart on Logout**: Shopping cart is cleared when customer logs out

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is for educational purposes.
