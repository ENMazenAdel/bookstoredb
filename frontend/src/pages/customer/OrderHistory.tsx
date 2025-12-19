import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomerOrder } from '../../types';
import { customerOrdersApi } from '../../services/api';
import { LoadingSpinner } from '../../components';
import { FaReceipt, FaCalendar, FaBoxOpen } from 'react-icons/fa';

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    try {
      const data = await customerOrdersApi.getByCustomer(user.id);
      setOrders(data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: { [key: string]: string } = {
      'Completed': 'bg-success',
      'Processing': 'bg-warning text-dark',
      'Cancelled': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

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

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        <FaReceipt className="me-2" />
        Order History
      </h2>

      <div className="row">
        {/* Orders List */}
        <div className="col-lg-5">
          <div className="list-group">
            {orders.map(order => (
              <button
                key={order.id}
                className={`list-group-item list-group-item-action ${selectedOrder?.id === order.id ? 'active' : ''}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="d-flex w-100 justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">{order.id}</h6>
                    <p className="mb-1 small">
                      <FaCalendar className="me-1" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    <small>{order.items.length} item(s)</small>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                    <p className={`mb-0 mt-1 fw-bold ${selectedOrder?.id === order.id ? '' : 'text-primary'}`}>
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="col-lg-7">
          {selectedOrder ? (
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Order Details - {selectedOrder.id}</h5>
              </div>
              <div className="card-body">
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
