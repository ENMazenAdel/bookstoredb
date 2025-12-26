/**
 * @fileoverview Report Type Definitions
 * 
 * This module defines TypeScript interfaces for various business reports
 * and analytics data used in the admin dashboard and reports page.
 * 
 * @module types/Reports
 */

/**
 * Aggregated sales report for a specific time period.
 * 
 * Provides high-level metrics for business performance tracking.
 * Used in the admin dashboard and monthly/daily reports.
 * 
 * @interface SalesReport
 * 
 * @example
 * const report: SalesReport = {
 *   totalSales: 15420.50,
 *   totalOrders: 342,
 *   period: '2024-01'  // January 2024
 * };
 */
export interface SalesReport {
  /** Total revenue generated in USD */
  totalSales: number;
  
  /** Number of orders completed */
  totalOrders: number;
  
  /** Time period for the report (e.g., 'YYYY-MM' or 'YYYY-MM-DD') */
  period: string;
}

/**
 * Individual book sales performance report.
 * 
 * Shows how well each book is selling, used for inventory
 * decisions and identifying bestsellers.
 * 
 * @interface BookSalesReport
 * 
 * @example
 * const bookReport: BookSalesReport = {
 *   isbn: '978-0-13-468599-1',
 *   title: 'The Great Gatsby',
 *   copiesSold: 156,
 *   totalRevenue: 2337.44
 * };
 */
export interface BookSalesReport {
  /** Book's ISBN identifier */
  isbn: string;
  
  /** Book title */
  title: string;
  
  /** Number of copies sold */
  copiesSold: number;
  
  /** Total revenue from this book (copiesSold * price) */
  totalRevenue: number;
}

/**
 * Top customer report based on purchase activity.
 * 
 * Identifies high-value customers for loyalty programs
 * and business analysis.
 * 
 * @interface TopCustomer
 * 
 * @example
 * const customer: TopCustomer = {
 *   customerId: 'user-001',
 *   customerName: 'John Doe',
 *   email: 'john@example.com',
 *   totalPurchaseAmount: 1250.75,
 *   orderCount: 15
 * };
 */
export interface TopCustomer {
  /** Customer's user ID */
  customerId: string;
  
  /** Customer's full name (firstName + lastName) */
  customerName: string;
  
  /** Customer's email address */
  email: string;
  
  /** Total amount spent by customer (USD) */
  totalPurchaseAmount: number;
  
  /** Number of orders placed by customer */
  orderCount: number;
}

/**
 * Book order frequency report.
 * 
 * Shows how frequently each book appears in orders,
 * useful for popularity analysis (different from copies sold).
 * 
 * @interface BookOrderCount
 * 
 * @example
 * const bookOrders: BookOrderCount = {
 *   isbn: '978-0-13-468599-1',
 *   title: 'The Great Gatsby',
 *   orderCount: 89  // Appears in 89 different orders
 * };
 */
export interface BookOrderCount {
  /** Book's ISBN identifier */
  isbn: string;
  
  /** Book title */
  title: string;
  
  /** Number of orders containing this book */
  orderCount: number;
}
