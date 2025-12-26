/**
 * ============================================================================
 * ORDER HISTORY PAGE (Customer)
 * ============================================================================
 * 
 * Page for viewing customer's past orders.
 * Displays a list of orders with details view.
 * 
 * LAYOUT:
 * - Left panel: List of all orders (clickable)
 * - Right panel: Selected order details
 * 
 * ORDER INFORMATION:
 * - Order ID (unique identifier)
 * - Order date
 * - Order status (Completed, Processing, Cancelled)
 * - Items list with quantities and prices
 * - Total amount
 * 
 * ORDER STATUSES:
 * - Completed: Order has been fulfilled (green badge)
 * - Processing: Order is being processed (yellow badge)
 * - Cancelled: Order was cancelled (red badge)
 * 
 * ACCESS: Authenticated customers only
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for component and state management
import React, { useState, useEffect } from 'react';

// Auth context for getting current user
import { useAuth } from '../../context/AuthContext';

// Type import for order data structure
import { CustomerOrder } from '../../types';

// API service for fetching orders
import { customerOrdersApi } from '../../services/api';

// Loading spinner component
import { LoadingSpinner } from '../../components';

// Icons for visual enhancement
import { FaReceipt, FaCalendar, FaBoxOpen } from 'react-icons/fa';

/**
 * OrderHistory Component
 * 
 * Displays a list of customer orders with details panel.
 * Orders are sorted by date (newest first).
 */
const OrderHistory: React.FC = () => {
  // ========================================
  // HOOKS AND CONTEXT
  // ========================================
  
  // Get current user from auth context
  const { user } = useAuth();

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // List of all customer orders
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  
  // Loading state while fetching orders
  const [isLoading, setIsLoading] = useState(true);
  
  // Currently selected order for details view
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // ========================================
  // DATA LOADING
  // ========================================

  /**
   * Effect: Load orders when user changes
   * Re-fetches orders if user logs in/out
   */
  useEffect(() => {
    loadOrders();
  }, [user]);

  /**
   * Loads all orders for the current customer
   * Sorts by date descending (newest first)
   */
  const loadOrders = async () => {
    if (!user) return;  // Don't fetch if no user
    try {
      const data = await customerOrdersApi.getByCustomer(user.id);
      // Sort orders by date - newest first
      setOrders(data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  /**
   * Returns the appropriate Bootstrap badge class for order status
   * @param status - Order status string
   * @returns Bootstrap badge class name
   */
  const getStatusBadge = (status: string) => {
    const classes: { [key: string]: string } = {
      'Completed': 'bg-success',       // Green for completed
      'Processing': 'bg-warning text-dark',  // Yellow for processing
      'Cancelled': 'bg-danger'         // Red for cancelled
    };
    return classes[status] || 'bg-secondary';  // Grey as fallback
  };

  // ========================================
  // RENDER
  // ========================================

  // Show loading spinner while fetching
  if (isLoading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  // ========== NO ORDERS STATE ==========
  if (orders.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <FaBoxOpen size={64} className="text-muted mb-3" />
          <h2>No Orders Yet</h2>
          <p className="text-muted">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  // ========== ORDERS LIST WITH DETAILS ==========
  return (
    <div className="container py-4">
      {/* Page Header */}
      <h2 className="mb-4">
        <FaReceipt className="me-2" />
        Order History
      </h2>

      <div className="row">
        {/* ========== LEFT PANEL: ORDERS LIST ========== */}
        <div className="col-lg-5">
          <div className="list-group">
            {/* Map through orders - each is clickable */}
            {orders.map(order => (
              <button
                key={order.id}
                className={`list-group-item list-group-item-action ${selectedOrder?.id === order.id ? 'active' : ''}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="d-flex w-100 justify-content-between align-items-start">
                  <div>
                    {/* Order ID */}
                    <h6 className="mb-1">{order.id}</h6>
                    {/* Order date with calendar icon */}
                    <p className="mb-1 small">
                      <FaCalendar className="me-1" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    {/* Item count */}
                    <small>{order.items.length} item(s)</small>
                  </div>
                  <div className="text-end">
                    {/* Status badge */}
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                    {/* Total amount */}
                    <p className={`mb-0 mt-1 fw-bold ${selectedOrder?.id === order.id ? '' : 'text-primary'}`}>
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ========== RIGHT PANEL: ORDER DETAILS ========== */}
        <div className="col-lg-7">
          {/* Show details if an order is selected */}
          {selectedOrder ? (
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Order Details - {selectedOrder.id}</h5>
              </div>
              <div className="card-body">
                {/* Order meta information */}
                <div className="row mb-3">
                  <div className="col-6">
                    <strong>Order Date:</strong>
                    <p className="mb-0">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div className="col-6 text-end">
                    <strong>Status:</strong>
                    <p className="mb-0">
                      <span className={`badge ${getStatusBadge(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>

                <hr />

                {/* Items table */}
                <h6>Items</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Map through order items */}
                      {selectedOrder.items.map(item => (
                        <tr key={item.isbn}>
                          <td><small>{item.isbn}</small></td>
                          <td>{item.title}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">${item.pricePerUnit.toFixed(2)}</td>
                          <td className="text-end">${item.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    {/* Order total in footer */}
                    <tfoot>
                      <tr className="table-primary">
                        <td colSpan={4} className="text-end fw-bold">Total:</td>
                        <td className="text-end fw-bold">${selectedOrder.totalAmount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <FaReceipt size={48} className="text-muted mb-3" />
                <p className="text-muted">Select an order to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
