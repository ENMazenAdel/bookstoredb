import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, PublisherOrder } from '../../types';
import { booksApi, ordersApi, reportsApi } from '../../services/api';
import { LoadingSpinner } from '../../components';
import { 
  FaBook, 
  FaShoppingCart, 
  FaExclamationTriangle, 
  FaDollarSign,
  FaChartLine 
} from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<PublisherOrder[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [booksData, ordersData, salesData] = await Promise.all([
        booksApi.getAll(),
        ordersApi.getAll(),
        reportsApi.getMonthlySales()
      ]);
      setBooks(booksData);
      setOrders(ordersData);
      setTotalSales(salesData.totalSales);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const lowStockBooks = books.filter(b => b.quantity < b.threshold);
  const pendingOrders = orders.filter(o => o.status === 'Pending');

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">
        <FaChartLine className="me-2" />
        Admin Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
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
