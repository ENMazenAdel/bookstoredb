import React, { useState, useEffect } from 'react';
import { PublisherOrder, Book } from '../../types';
import { ordersApi, booksApi } from '../../services/api';
import { LoadingSpinner } from '../../components';
import { FaTruck, FaCheck, FaTimes, FaPlus, FaSearch } from 'react-icons/fa';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<PublisherOrder[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(20);
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, booksData] = await Promise.all([
        ordersApi.getAll(),
        booksApi.getAll()
      ]);
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

  const filteredOrders = orders.filter(order => 
    !filterStatus || order.status === filterStatus
  );

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing('new');

    try {
      await ordersApi.place(selectedBook, orderQuantity);
      setSuccess('Order placed successfully!');
      await loadData();
      setShowModal(false);
      setSelectedBook('');
      setOrderQuantity(20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setProcessing(null);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    setError('');
    setProcessing(orderId);

    try {
      await ordersApi.confirm(orderId);
      setSuccess('Order confirmed! Stock has been updated.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm order');
    } finally {
      setProcessing(null);
    }
  };

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

  const getStatusBadge = (status: string) => {
    const classes: { [key: string]: string } = {
      'Pending': 'bg-warning text-dark',
      'Confirmed': 'bg-success',
      'Cancelled': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <div className="container-fluid py-4">
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

      {/* Filter */}
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
