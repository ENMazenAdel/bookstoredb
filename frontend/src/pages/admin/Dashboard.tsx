/**
 * ============================================================================
 * ADMIN DASHBOARD PAGE
 * ============================================================================
 * 
 * Main dashboard for administrators displaying key business metrics.
 * This is the landing page for admin users after login.
 * 
 * DISPLAYED METRICS:
 * - Total Books: Count of all books in inventory
 * - Monthly Sales: Total sales revenue for the previous month
 * - Pending Orders: Count of publisher orders awaiting confirmation
 * - Low Stock Alert: Count of books below their threshold
 * 
 * FEATURES:
 * - Real-time data loading from API
 * - Quick navigation links to management pages
 * - Low stock alert list with direct access to order more
 * - Pending orders list with confirm/cancel actions
 * 
 * ACCESS: Admin users only (protected by ProtectedRoute)
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for component and lifecycle management
import React, { useState, useEffect } from 'react';

// Router for navigation links
import { Link } from 'react-router-dom';

// Type imports for TypeScript type safety
import { Book, PublisherOrder } from '../../types';

// API services for fetching dashboard data
import { booksApi, ordersApi, reportsApi } from '../../services/api';

// Shared UI component for loading state
import { LoadingSpinner } from '../../components';

// Icons for visual enhancement
import { 
  FaBook,               // Books icon
  FaShoppingCart,       // Orders icon
  FaExclamationTriangle, // Warning/alert icon
  FaDollarSign,         // Sales/money icon
  FaChartLine           // Dashboard/chart icon
} from 'react-icons/fa';

/**
 * Dashboard Component
 * 
 * Renders the admin dashboard with stats cards and alert lists.
 * Loads data from multiple APIs in parallel for performance.
 */
const Dashboard: React.FC = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Books data for inventory metrics
  const [books, setBooks] = useState<Book[]>([]);
  
  // Publisher orders for pending orders metric
  const [orders, setOrders] = useState<PublisherOrder[]>([]);
  
  // Total monthly sales from reports API
  const [totalSales, setTotalSales] = useState(0);
  
  // Loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);

  // ========================================
  // DATA LOADING
  // ========================================
  
  /**
   * Effect: Load dashboard data on component mount
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Loads all dashboard data from multiple APIs in parallel
   * Uses Promise.all for efficient parallel fetching
   */
  const loadDashboardData = async () => {
    try {
      // Fetch all data in parallel for better performance
      const [booksData, ordersData, salesData] = await Promise.all([
        booksApi.getAll(),           // Get all books for inventory count
        ordersApi.getAll(),          // Get all orders for pending count
        reportsApi.getMonthlySales() // Get previous month sales
      ]);
      
      // Update state with fetched data
      setBooks(booksData);
      setOrders(ordersData);
      setTotalSales(salesData.totalSales);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // LOADING STATE
  // ========================================
  
  // Show loading spinner while data is being fetched
  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // ========================================
  // DERIVED DATA (Computed from state)
  // ========================================
  
  // Books with stock below their threshold - need attention
  const lowStockBooks = books.filter(b => b.quantity < b.threshold);
  
  // Orders waiting for admin to confirm or cancel
  const pendingOrders = orders.filter(o => o.status === 'Pending');

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="container-fluid py-4">
      {/* Page Title */}
      <h2 className="mb-4">
        <FaChartLine className="me-2" />
        Admin Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {/* Total Books Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Total Books</h6>
                  <h2 className="mb-0">{books.length}</h2>
                </div>
                <FaBook size={40} className="opacity-50" />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0">
              <Link to="/admin/books" className="text-white text-decoration-none small">
                Manage Books →
              </Link>
            </div>
          </div>
        </div>

        {/* Monthly Sales Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Monthly Sales</h6>
                  <h2 className="mb-0">${totalSales.toFixed(2)}</h2>
                </div>
                <FaDollarSign size={40} className="opacity-50" />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0">
              <Link to="/admin/reports" className="text-white text-decoration-none small">
                View Reports →
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="opacity-75">Pending Orders</h6>
                  <h2 className="mb-0">{pendingOrders.length}</h2>
                </div>
                <FaShoppingCart size={40} className="opacity-50" />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0">
              <Link to="/admin/orders" className="text-dark text-decoration-none small">
                View Orders →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card bg-danger text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Low Stock</h6>
                  <h2 className="mb-0">{lowStockBooks.length}</h2>
                </div>
                <FaExclamationTriangle size={40} className="opacity-50" />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0">
              <Link to="/admin/books" className="text-white text-decoration-none small">
                View Low Stock →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Low Stock Alert */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <FaExclamationTriangle className="me-2" />
                Low Stock Alert
              </h5>
            </div>
            <div className="card-body">
              {lowStockBooks.length === 0 ? (
                <p className="text-muted text-center py-3">All books are adequately stocked</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th className="text-center">Stock</th>
                        <th className="text-center">Threshold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockBooks.slice(0, 5).map(book => (
                        <tr key={book.isbn}>
                          <td className="text-truncate" style={{ maxWidth: '200px' }}>
                            {book.title}
                          </td>
                          <td className="text-center">
                            <span className="badge bg-danger">{book.quantity}</span>
                          </td>
                          <td className="text-center">{book.threshold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <FaShoppingCart className="me-2" />
                Pending Publisher Orders
              </h5>
            </div>
            <div className="card-body">
              {pendingOrders.length === 0 ? (
                <p className="text-muted text-center py-3">No pending orders</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Book</th>
                        <th className="text-center">Qty</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingOrders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                          <td><small>{order.id}</small></td>
                          <td className="text-truncate" style={{ maxWidth: '150px' }}>
                            {order.bookTitle}
                          </td>
                          <td className="text-center">{order.quantity}</td>
                          <td><small>{order.orderDate}</small></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Books */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <FaBook className="me-2" />
                Book Inventory Overview
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ISBN</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th className="text-end">Price</th>
                      <th className="text-center">Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.slice(0, 8).map(book => (
                      <tr key={book.isbn}>
                        <td><small>{book.isbn}</small></td>
                        <td>{book.title}</td>
                        <td>
                          <span className="badge bg-secondary">{book.category}</span>
                        </td>
                        <td className="text-end">${book.sellingPrice.toFixed(2)}</td>
                        <td className="text-center">{book.quantity}</td>
                        <td>
                          {book.quantity === 0 ? (
                            <span className="badge bg-danger">Out of Stock</span>
                          ) : book.quantity < book.threshold ? (
                            <span className="badge bg-warning text-dark">Low Stock</span>
                          ) : (
                            <span className="badge bg-success">In Stock</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
