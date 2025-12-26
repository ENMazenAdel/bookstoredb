/**
 * @fileoverview Main Application Component
 * 
 * This is the root component of the Bookstore React application.
 * It sets up the application structure including:
 * - Context providers (Auth, Cart)
 * - React Router configuration
 * - Route definitions with role-based protection
 * - Layout structure (Navbar, Main content, Footer)
 * 
 * @module App
 * 
 * @description
 * Route Structure:
 * 
 * PUBLIC ROUTES (accessible to all):
 * - / : Home page with featured books and categories
 * - /books : Browse all books with filtering
 * - /login : User authentication
 * - /register : New user registration
 * 
 * CUSTOMER ROUTES (requires 'customer' role):
 * - /cart : Shopping cart with checkout
 * - /orders : Order history
 * - /profile/edit : Edit profile information
 * 
 * SHARED PROTECTED ROUTES (any authenticated user):
 * - /profile : View profile information
 * 
 * ADMIN ROUTES (requires 'admin' role):
 * - /admin/dashboard : Business metrics overview
 * - /admin/books : Book inventory management (CRUD)
 * - /admin/orders : Publisher order management
 * - /admin/reports : Sales and analytics reports
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar, Footer, ProtectedRoute } from './components';

// Auth pages
import { Login, Register } from './pages/auth';

// Customer pages
import { Home, BrowseBooks, Cart, OrderHistory, Profile, EditProfile } from './pages/customer';

// Admin pages
import { Dashboard, BookManagement, OrderManagement, Reports } from './pages/admin';

// Bootstrap CSS and JS for styling and interactive components
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

// Get the base URL for GitHub Pages deployment
// This ensures routes work correctly when deployed to a subdirectory
const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router basename={basename}>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<BrowseBooks />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/books"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <BookManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <OrderManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
