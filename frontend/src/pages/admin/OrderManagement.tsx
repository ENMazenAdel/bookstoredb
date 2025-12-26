/**
 * ============================================================================
 * PUBLISHER ORDER MANAGEMENT PAGE (Admin)
 * ============================================================================
 * 
 * Admin page for managing publisher replenishment orders.
 * Allows viewing, creating, confirming, and cancelling orders to publishers.
 * 
 * FEATURES:
 * - View all publisher orders with status filtering
 * - Place new orders to publishers manually
 * - Confirm pending orders (updates book stock via trigger)
 * - Cancel pending orders
 * - View auto-created orders from threshold trigger
 * 
 * ORDER LIFECYCLE:
 * 1. Order is created (manually or by auto-replenish trigger)
 * 2. Order starts in "Pending" status
 * 3. Admin confirms order → Stock is added to inventory (trigger)
 * 4. OR Admin cancels order → No stock change
 * 
 * DATABASE TRIGGERS DEMONSTRATED:
 * - When confirming an order, the ordered quantity is automatically
 *   added to the book's stock (simulating receiving shipment)
 * 
 * ACCESS: Admin users only (protected by ProtectedRoute)
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for component and lifecycle management
import React, { useState, useEffect } from 'react';

// Type imports for TypeScript type safety
import { PublisherOrder, Book } from '../../types';

// API services for order and book operations
import { ordersApi, booksApi } from '../../services/api';

// Shared UI component for loading state
import { LoadingSpinner } from '../../components';

// Icons for visual enhancement
import { FaTruck, FaCheck, FaTimes, FaPlus, FaSearch } from 'react-icons/fa';

/**
 * OrderManagement Component
 * 
 * Renders the publisher order management interface with:
 * - Filter controls by order status
 * - Orders table with action buttons
 * - Modal form for placing new orders
 */
const OrderManagement: React.FC = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Data state
  const [orders, setOrders] = useState<PublisherOrder[]>([]);  // All orders from API
  const [books, setBooks] = useState<Book[]>([]);              // Books for dropdown
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);            // Initial load state
  const [showModal, setShowModal] = useState(false);           // Modal visibility
  
  // Form state for new order
  const [selectedBook, setSelectedBook] = useState('');        // Selected book ISBN
  const [orderQuantity, setOrderQuantity] = useState(20);      // Default order quantity
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState('');        // Status filter
  
  // Feedback state
  const [error, setError] = useState('');                      // Error message
  const [success, setSuccess] = useState('');                  // Success message
  const [processing, setProcessing] = useState<string | null>(null); // Currently processing order ID

  // ========================================
  // DATA LOADING
  // ========================================

  /**
   * Effect: Load initial data on component mount
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Loads orders and books data from APIs
   * Sorts orders by date (newest first)
   */
  const loadData = async () => {
    try {
      const [ordersData, booksData] = await Promise.all([
        ordersApi.getAll(),
        booksApi.getAll()
      ]);
      // Sort orders by date, newest first
      setOrders(ordersData.sort((a, b) => 
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      ));
      setBooks(booksData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // FILTERING LOGIC
  // ========================================
  
  /**
   * Filters orders based on selected status
   */
  const filteredOrders = orders.filter(order => 
    !filterStatus || order.status === filterStatus
  );

  // ========================================
  // ACTION HANDLERS
  // ========================================

  /**
   * Handles placing a new publisher order
   * Creates an order for the selected book with specified quantity
   */
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing('new');

    try {
      await ordersApi.place(selectedBook, orderQuantity);
      setSuccess('Order placed successfully!');
      await loadData();
      // Reset form and close modal
      setShowModal(false);
      setSelectedBook('');
      setOrderQuantity(20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setProcessing(null);
    }
  };

  /**
   * Handles confirming a pending order
   * TRIGGER: This adds the ordered quantity to book stock
   */
  const handleConfirmOrder = async (orderId: string) => {
    setError('');
    setProcessing(orderId);

    try {
      // Confirming triggers stock update in the API
      await ordersApi.confirm(orderId);
      setSuccess('Order confirmed! Stock has been updated.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm order');
    } finally {
      setProcessing(null);
    }
  };

  /**
   * Handles cancelling a pending order
   * No stock changes when cancelling
   */
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setError('');
    setProcessing(orderId);

    try {
      await ordersApi.cancel(orderId);
      setSuccess('Order cancelled.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
    } finally {
      setProcessing(null);
    }
  };

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  /**
   * Returns Bootstrap badge class based on order status
   */
  const getStatusBadge = (status: string) => {
    const classes: { [key: string]: string } = {
      'Pending': 'bg-warning text-dark',   // Yellow for pending
      'Confirmed': 'bg-success',            // Green for confirmed
      'Cancelled': 'bg-danger'              // Red for cancelled
    };
    return classes[status] || 'bg-secondary';
  };

  // ========================================
  // LOADING STATE
  // ========================================

  if (isLoading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="container-fluid py-4">
      {/* Header with title and action button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaTruck className="me-2" />
          Publisher Orders
        </h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-1" />
          Place New Order
        </button>
      </div>

      {/* Error/Success alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Filter Controls */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-8 text-end">
              <span className="text-muted">
                Showing {filteredOrders.length} of {orders.length} orders
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Book ISBN</th>
                  <th>Book Title</th>
                  <th>Publisher</th>
                  <th className="text-center">Quantity</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td><small className="fw-bold">{order.id}</small></td>
                    <td><small>{order.bookIsbn}</small></td>
                    <td>{order.bookTitle}</td>
                    <td>{order.publisher}</td>
                    <td className="text-center">{order.quantity}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {order.status === 'Pending' && (
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-success"
                            onClick={() => handleConfirmOrder(order.id)}
                            disabled={processing === order.id}
                            title="Confirm Order"
                          >
                            {processing === order.id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={processing === order.id}
                            title="Cancel Order"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                      {order.status !== 'Pending' && (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <p className="text-center text-muted py-3">No orders found</p>
          )}
        </div>
      </div>

      {/* Place Order Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Place New Order</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handlePlaceOrder}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Book *</label>
                    <select
                      className="form-select"
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                      required
                    >
                      <option value="">Choose a book...</option>
                      {books.map(book => (
                        <option key={book.isbn} value={book.isbn}>
                          {book.title} (Stock: {book.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 0)}
                      min="1"
                      required
                    />
                    <small className="text-muted">Default order quantity is 20 units</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={processing === 'new'}>
                    {processing === 'new' ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Placing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
