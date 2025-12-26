/**
 * ============================================================================
 * REPORTS PAGE (Admin)
 * ============================================================================
 * 
 * Admin page for viewing business analytics and sales reports.
 * Provides various report types for monitoring bookstore performance.
 * 
 * AVAILABLE REPORTS:
 * 
 * 1. MONTHLY SALES REPORT
 *    - Total revenue for the previous month
 *    - Total number of orders
 *    - Analysis period displayed
 * 
 * 2. DAILY SALES REPORT
 *    - Sales statistics for a specific date
 *    - User can select any date to view
 * 
 * 3. TOP 5 CUSTOMERS (Last 3 Months)
 *    - Ranked by total purchase amount
 *    - Shows customer name, email, order count
 *    - Useful for VIP program or loyalty rewards
 * 
 * 4. TOP 10 SELLING BOOKS (Last 3 Months)
 *    - Ranked by copies sold
 *    - Shows book title, copies sold, revenue
 *    - Useful for inventory planning
 * 
 * 5. BOOK ORDER COUNT
 *    - Number of publisher orders for a specific book
 *    - Helps analyze replenishment patterns
 * 
 * ACCESS: Admin users only (protected by ProtectedRoute)
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for component and lifecycle management
import React, { useState, useEffect } from 'react';

// Type imports for report data structures
import { 
  SalesReport,       // Monthly/daily sales data
  BookSalesReport,   // Top selling books data
  TopCustomer,       // Top customers data
  BookOrderCount,    // Book order count data
  Book               // Book type for dropdown
} from '../../types';

// API services for fetching reports and books
import { reportsApi, booksApi } from '../../services/api';

// Shared UI component for loading state
import { LoadingSpinner } from '../../components';

// Icons for visual enhancement
import { 
  FaChartBar,     // Reports/charts icon
  FaCalendar,     // Date/calendar icon
  FaUsers,        // Customers icon
  FaBook,         // Books icon
  FaTruck,        // Orders/shipping icon
  FaDollarSign    // Money/sales icon
} from 'react-icons/fa';

/**
 * Reports Component
 * 
 * Renders the reports page with tabbed navigation.
 * Each tab shows a different type of report.
 */
const Reports: React.FC = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState('monthly');  // Currently active report tab
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Report data state - each report type has its own state
  const [monthlySales, setMonthlySales] = useState<SalesReport | null>(null);
  const [dailySales, setDailySales] = useState<SalesReport | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [topBooks, setTopBooks] = useState<BookSalesReport[]>([]);
  const [bookOrderCount, setBookOrderCount] = useState<BookOrderCount | null>(null);
  
  // Form input state for interactive reports
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Today's date
  const [selectedBook, setSelectedBook] = useState('');   // Selected book ISBN
  const [books, setBooks] = useState<Book[]>([]);         // Books for dropdown

  // ========================================
  // DATA LOADING
  // ========================================

  /**
   * Effect: Load books list for dropdown on component mount
   */
  useEffect(() => {
    loadBooks();
  }, []);

  /**
   * Effect: Load report data when active tab changes
   */
  useEffect(() => {
    loadReportData();
  }, [activeTab]);

  /**
   * Loads books for the book selection dropdown
   */
  const loadBooks = async () => {
    const data = await booksApi.getAll();
    setBooks(data);
  };

  /**
   * Loads the appropriate report data based on active tab
   * Uses switch statement to determine which API to call
   */
  const loadReportData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'monthly':
          // Fetch previous month sales data
          const monthly = await reportsApi.getMonthlySales();
          setMonthlySales(monthly);
          break;
        case 'topCustomers':
          // Fetch top 5 customers from last 3 months
          const customers = await reportsApi.getTopCustomers();
          setTopCustomers(customers);
          break;
        case 'topBooks':
          // Fetch top 10 selling books from last 3 months
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

  /**
   * Loads daily sales report for the selected date
   * Called when user clicks "Get Report" button
   */
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

  /**
   * Loads book order count for the selected book
   * Called when user clicks "Get Count" button
   */
  const loadBookOrderCount = async () => {
    if (!selectedBook) return;  // Don't proceed if no book selected
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

  // ========================================
  // RENDER FUNCTIONS FOR EACH REPORT
  // ========================================

  /**
   * Renders the content for the currently active tab
   * Uses switch statement to return appropriate JSX
   */
  const renderContent = () => {
    // Show loading spinner while data is being fetched
    if (isLoading) {
      return <LoadingSpinner message="Loading report..." />;
    }

    switch (activeTab) {
      // ========== Monthly Sales Report ==========
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
                  {/* Period display */}
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Period</h6>
                      <p className="h5 mb-0">{monthlySales.period}</p>
                    </div>
                  </div>
                  {/* Total orders count */}
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Total Orders</h6>
                      <p className="h3 text-primary mb-0">{monthlySales.totalOrders}</p>
                    </div>
                  </div>
                  {/* Total revenue */}
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

      // ========== Daily Sales Report ==========
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

      // ========== Top Customers Report ==========
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
              {/* Conditional rendering: show table if data exists, otherwise show message */}
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
                      {/* Map through customers - top 3 get gold badges */}
                      {topCustomers.map((customer, index) => (
                        <tr key={customer.customerId}>
                          <td>
                            {/* Gold badge for top 3, grey for others */}
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

      // ========== Top Selling Books Report ==========
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
              {/* Conditional rendering: show table if data exists */}
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
                      {/* Map through books - top 3 get green badges */}
                      {topBooks.map((book, index) => (
                        <tr key={book.isbn}>
                          <td>
                            {/* Green badge for top 3, grey for others */}
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

      // ========== Book Order Count Report ==========
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
              {/* Book selection form */}
              <div className="row mb-4">
                <div className="col-md-8">
                  <div className="input-group">
                    {/* Dropdown to select book by title */}
                    <select
                      className="form-select"
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                    >
                      <option value="">Select a book...</option>
                      {/* Populate dropdown with all books */}
                      {books.map(book => (
                        <option key={book.isbn} value={book.isbn}>
                          {book.title}
                        </option>
                      ))}
                    </select>
                    {/* Button disabled until book is selected */}
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
              {/* Display result if available */}
              {bookOrderCount ? (
                <div className="row text-center">
                  {/* Book info card */}
                  <div className="col-md-6 mb-3">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Book</h6>
                      <p className="h5 mb-0">{bookOrderCount.title}</p>
                      <small className="text-muted">{bookOrderCount.isbn}</small>
                    </div>
                  </div>
                  {/* Order count card */}
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

      // Default case - should never reach here
      default:
        return null;
    }
  };

  // ========================================
  // MAIN COMPONENT RENDER
  // ========================================

  return (
    <div className="container-fluid py-4">
      {/* Page title */}
      <h2 className="mb-4">
        <FaChartBar className="me-2" />
        System Reports
      </h2>

      {/* Tab Navigation - allows switching between report types */}
      <ul className="nav nav-tabs mb-4">
        {/* Monthly Sales Tab */}
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            <FaDollarSign className="me-1" />
            Monthly Sales
          </button>
        </li>
        {/* Daily Sales Tab */}
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            <FaCalendar className="me-1" />
            Daily Sales
          </button>
        </li>
        {/* Top Customers Tab */}
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'topCustomers' ? 'active' : ''}`}
            onClick={() => setActiveTab('topCustomers')}
          >
            <FaUsers className="me-1" />
            Top Customers
          </button>
        </li>
        {/* Top Books Tab */}
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'topBooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('topBooks')}
          >
            <FaBook className="me-1" />
            Top Books
          </button>
        </li>
        {/* Book Orders Tab */}
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

      {/* Report Content - rendered based on active tab */}
      {renderContent()}
    </div>
  );
};

// Export component for use in routing
export default Reports;
