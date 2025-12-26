/**
 * ============================================================================
 * NAVIGATION BAR COMPONENT
 * ============================================================================
 * 
 * Main navigation component displayed at the top of every page.
 * Provides access to all major sections of the application.
 * 
 * FEATURES:
 * 1. Responsive design with mobile hamburger menu
 * 2. Role-based navigation links (admin vs customer)
 * 3. Shopping cart icon with item count badge
 * 4. User profile dropdown with logout
 * 5. Active state highlighting for current route
 * 
 * NAVIGATION LINKS BY ROLE:
 * 
 * PUBLIC (Unauthenticated):
 * - Home
 * - Browse Books
 * - Login / Register
 * 
 * CUSTOMER (Authenticated):
 * - Home
 * - Browse Books
 * - Cart (with item count)
 * - Profile
 * - Order History
 * - Logout
 * 
 * ADMIN:
 * - Dashboard
 * - Books Management
 * - Orders Management
 * - Reports
 * - Browse Books (as customer)
 * - Cart (can also shop)
 * - Profile
 * - Logout
 * 
 * STYLING:
 * - Sticky positioning with blur effect
 * - Gradient brand logo
 * - Pill-shaped navigation links
 * - Animated badge for cart count
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React import
import React from 'react';

// Router hooks and components for navigation
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Context hooks for auth and cart state
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Icons for navigation items
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBook, FaChartBar, FaBoxes, FaClipboardList, FaTachometerAlt } from 'react-icons/fa';

/**
 * Navbar Component
 * 
 * Renders the main navigation bar with role-based links.
 * Includes cart icon, user menu, and logout functionality.
 */
const Navbar: React.FC = () => {
  // ========================================
  // HOOKS AND CONTEXT
  // ========================================
  
  // Auth context for user data and logout
  const { user, isAuthenticated, logout } = useAuth();
  
  // Cart context for item count badge
  const { cart } = useCart();
  
  // Navigation and location hooks
  const navigate = useNavigate();
  const location = useLocation();

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /**
   * Handles user logout
   * Logs out user and redirects to login page
   */
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  /**
   * Checks if the given path matches the current location
   * Used for highlighting active navigation links
   * @param path - Path to check
   * @returns True if path matches current location
   */
  const isActive = (path: string) => location.pathname === path;

  // ========================================
  // RENDER
  // ========================================

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
    }}>
      <div className="container">
        {/* ========== BRAND LOGO ========== */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div style={{
            background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FaBook className="text-white" size={20} />
          </div>
          <span className="fw-bold ms-2" style={{
            fontSize: '1.4rem',
            background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>BookStore</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ========== NAVIGATION LINKS ========== */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto ms-4">
            {/* Browse Books - Available to all users */}
            <li className="nav-item">
              <Link
                className={`nav-link px-3 py-2 rounded-pill mx-1 ${isActive('/books') ? 'active' : ''}`}
                to="/books"
                style={{
                  color: isActive('/books') ? '#f43f5e' : '#64748b',
                  backgroundColor: isActive('/books') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                Browse Books
              </Link>
            </li>
            
            {/* ========== ADMIN-ONLY LINKS ========== */}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                {/* Dashboard Link */}
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 py-2 rounded-pill mx-1 d-flex align-items-center ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    to="/admin/dashboard"
                    style={{
                      color: isActive('/admin/dashboard') ? '#f43f5e' : '#64748b',
                      backgroundColor: isActive('/admin/dashboard') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                      fontWeight: 500
                    }}
                  >
                    <FaTachometerAlt className="me-1" size={14} />
                    Dashboard
                  </Link>
                </li>
                {/* Books Management Link */}
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 py-2 rounded-pill mx-1 d-flex align-items-center ${isActive('/admin/books') ? 'active' : ''}`}
                    to="/admin/books"
                    style={{
                      color: isActive('/admin/books') ? '#f43f5e' : '#64748b',
                      backgroundColor: isActive('/admin/books') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                      fontWeight: 500
                    }}
                  >
                    <FaBoxes className="me-1" size={14} />
                    Books
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 py-2 rounded-pill mx-1 d-flex align-items-center ${isActive('/admin/orders') ? 'active' : ''}`}
                    to="/admin/orders"
                    style={{
                      color: isActive('/admin/orders') ? '#f43f5e' : '#64748b',
                      backgroundColor: isActive('/admin/orders') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                      fontWeight: 500
                    }}
                  >
                    <FaClipboardList className="me-1" size={14} />
                    Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 py-2 rounded-pill mx-1 d-flex align-items-center ${isActive('/admin/reports') ? 'active' : ''}`}
                    to="/admin/reports"
                    style={{
                      color: isActive('/admin/reports') ? '#f43f5e' : '#64748b',
                      backgroundColor: isActive('/admin/reports') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                      fontWeight: 500
                    }}
                  >
                    <FaChartBar className="me-1" size={14} />
                    Reports
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav align-items-center">
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <>
                    <li className="nav-item me-2">
                      <Link
                        className="nav-link position-relative p-2 rounded-circle"
                        to="/cart"
                        style={{
                          backgroundColor: isActive('/cart') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                          color: '#64748b'
                        }}
                      >
                        <FaShoppingCart size={20} />
                        {cart.totalItems > 0 && (
                          <span
                            className="position-absolute badge rounded-pill"
                            style={{
                              top: '-4px',
                              right: '-4px',
                              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                              fontSize: '0.7rem',
                              padding: '4px 7px'
                            }}
                          >
                            {cart.totalItems}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link px-3 py-2 rounded-pill ${isActive('/orders') ? 'active' : ''}`}
                        to="/orders"
                        style={{
                          color: isActive('/orders') ? '#f43f5e' : '#64748b',
                          backgroundColor: isActive('/orders') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                          fontWeight: 500
                        }}
                      >
                        My Orders
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item dropdown ms-2">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center px-3 py-2 rounded-pill"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{
                      backgroundColor: 'rgba(244, 63, 94, 0.1)',
                      color: '#f43f5e',
                      fontWeight: 500
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '8px'
                    }}>
                      <FaUser className="text-white" size={12} />
                    </div>
                    {user?.firstName}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-3 p-2" style={{ minWidth: '180px' }}>
                    <li>
                      <Link className="dropdown-item rounded-2 py-2 px-3" to="/profile">
                        <FaUser className="me-2 text-muted" size={14} />
                        Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-2" /></li>
                    <li>
                      <button
                        className="dropdown-item rounded-2 py-2 px-3"
                        onClick={handleLogout}
                        style={{ color: '#ef4444' }}
                      >
                        <FaSignOutAlt className="me-2" size={14} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link px-3 py-2 rounded-pill"
                    to="/login"
                    style={{ color: '#64748b', fontWeight: 500 }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link
                    className="btn px-4 py-2 rounded-pill text-white"
                    to="/register"
                    style={{
                      background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                      fontWeight: 500,
                      border: 'none'
                    }}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
