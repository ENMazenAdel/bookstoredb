import React, { useState, useEffect } from 'react';
import { 
  SalesReport, 
  BookSalesReport, 
  TopCustomer, 
  BookOrderCount,
  Book 
} from '../../types';
import { reportsApi, booksApi } from '../../services/api';
import { LoadingSpinner } from '../../components';
import { 
  FaChartBar, 
  FaCalendar, 
  FaUsers, 
  FaBook, 
  FaTruck,
  FaDollarSign 
} from 'react-icons/fa';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  
  // Report data
  const [monthlySales, setMonthlySales] = useState<SalesReport | null>(null);
  const [dailySales, setDailySales] = useState<SalesReport | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [topBooks, setTopBooks] = useState<BookSalesReport[]>([]);
  const [bookOrderCount, setBookOrderCount] = useState<BookOrderCount | null>(null);
  
  // Form inputs
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBook, setSelectedBook] = useState('');
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    loadReportData();
  }, [activeTab]);

  const loadBooks = async () => {
    const data = await booksApi.getAll();
    setBooks(data);
  };

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'monthly':
          const monthly = await reportsApi.getMonthlySales();
          setMonthlySales(monthly);
          break;
        case 'topCustomers':
          const customers = await reportsApi.getTopCustomers();
          setTopCustomers(customers);
          break;
        case 'topBooks':
          const booksReport = await reportsApi.getTopSellingBooks();
          setTopBooks(booksReport);
          break;
      }
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDailySales = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getDailySales(selectedDate);
      setDailySales(data);
    } catch (error) {
      console.error('Failed to load daily sales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookOrderCount = async () => {
    if (!selectedBook) return;
    setIsLoading(true);
    try {
      const data = await reportsApi.getBookOrderCount(selectedBook);
      setBookOrderCount(data);
    } catch (error) {
      console.error('Failed to load book order count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Loading report..." />;
    }

    switch (activeTab) {
      case 'monthly':
        return (
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <FaDollarSign className="me-2" />
                Previous Month Sales Report
              </h5>
            </div>
            <div className="card-body">
              {monthlySales ? (
                <div className="row text-center">
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Period</h6>
                      <p className="h5 mb-0">{monthlySales.period}</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Total Orders</h6>
                      <p className="h3 text-primary mb-0">{monthlySales.totalOrders}</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Total Sales</h6>
                      <p className="h3 text-success mb-0">${monthlySales.totalSales.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted text-center">No data available</p>
              )}
            </div>
          </div>
        );

      case 'daily':
        return (
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <FaCalendar className="me-2" />
                Daily Sales Report
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="date"
                      className="form-control"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={loadDailySales}>
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
              {dailySales ? (
                <div className="row text-center">
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Date</h6>
                      <p className="h5 mb-0">{dailySales.period}</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Total Orders</h6>
                      <p className="h3 text-primary mb-0">{dailySales.totalOrders}</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Total Sales</h6>
                      <p className="h3 text-success mb-0">${dailySales.totalSales.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted text-center">Select a date and generate report</p>
              )}
            </div>
          </div>
        );

      case 'topCustomers':
        return (
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <FaUsers className="me-2" />
                Top 5 Customers (Last 3 Months)
              </h5>
            </div>
            <div className="card-body">
              {topCustomers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th className="text-center">Orders</th>
                        <th className="text-end">Total Purchases</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCustomers.map((customer, index) => (
                        <tr key={customer.customerId}>
                          <td>
                            <span className={`badge ${index < 3 ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                              {index + 1}
                            </span>
                          </td>
                          <td>{customer.customerName}</td>
                          <td>{customer.email}</td>
                          <td className="text-center">{customer.orderCount}</td>
                          <td className="text-end fw-bold text-success">
                            ${customer.totalPurchaseAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No customer data available</p>
              )}
            </div>
          </div>
        );

      case 'topBooks':
        return (
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <FaBook className="me-2" />
                Top 10 Selling Books (Last 3 Months)
              </h5>
            </div>
            <div className="card-body">
              {topBooks.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th className="text-center">Copies Sold</th>
                        <th className="text-end">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topBooks.map((book, index) => (
                        <tr key={book.isbn}>
                          <td>
                            <span className={`badge ${index < 3 ? 'bg-success' : 'bg-secondary'}`}>
                              {index + 1}
                            </span>
                          </td>
                          <td><small>{book.isbn}</small></td>
                          <td>{book.title}</td>
                          <td className="text-center fw-bold">{book.copiesSold}</td>
                          <td className="text-end text-success">
                            ${book.totalRevenue.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No sales data available</p>
              )}
            </div>
          </div>
        );

      case 'bookOrders':
        return (
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">
                <FaTruck className="me-2" />
                Book Replenishment Order Count
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-8">
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                    >
                      <option value="">Select a book...</option>
                      {books.map(book => (
                        <option key={book.isbn} value={book.isbn}>
                          {book.title}
                        </option>
                      ))}
                    </select>
                    <button 
                      className="btn btn-primary" 
                      onClick={loadBookOrderCount}
                      disabled={!selectedBook}
                    >
                      Get Count
                    </button>
                  </div>
                </div>
              </div>
              {bookOrderCount ? (
                <div className="row text-center">
                  <div className="col-md-6 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Book</h6>
                      <p className="h5 mb-0">{bookOrderCount.title}</p>
                      <small className="text-muted">{bookOrderCount.isbn}</small>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Times Ordered from Publisher</h6>
                      <p className="h2 text-primary mb-0">{bookOrderCount.orderCount}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted text-center">Select a book to see order count</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">
        <FaChartBar className="me-2" />
        System Reports
      </h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            <FaDollarSign className="me-1" />
            Monthly Sales
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            <FaCalendar className="me-1" />
            Daily Sales
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'topCustomers' ? 'active' : ''}`}
            onClick={() => setActiveTab('topCustomers')}
          >
            <FaUsers className="me-1" />
            Top Customers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'topBooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('topBooks')}
          >
            <FaBook className="me-1" />
            Top Books
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'bookOrders' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookOrders')}
          >
            <FaTruck className="me-1" />
            Book Orders
          </button>
        </li>
      </ul>

      {/* Report Content */}
      {renderContent()}
    </div>
  );
};

export default Reports;
