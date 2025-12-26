/**
 * @fileoverview Customer Order Type Definitions
 * 
 * This module defines TypeScript interfaces for customer orders,
 * representing purchases made by customers in the bookstore.
 * Different from publisher orders (see Order.ts) which are for restocking.
 * 
 * @module types/CustomerOrder
 */

/**
 * Represents a single line item in a customer's order.
 * 
 * Contains book information and quantity with pre-calculated prices
 * for historical accuracy (prices may change after order is placed).
 * 
 * @interface CustomerOrderItem
 * 
 * @example
 * const item: CustomerOrderItem = {
 *   isbn: '978-0-13-468599-1',
 *   title: 'The Great Gatsby',
 *   quantity: 2,
 *   pricePerUnit: 14.99,
 *   totalPrice: 29.98
 * };
 */
export interface CustomerOrderItem {
  /** ISBN of the purchased book */
  isbn: string;
  
  /** Book title at time of purchase (denormalized for history) */
  title: string;
  
  /** Number of copies purchased */
  quantity: number;
  
  /** Price per book at time of purchase (USD) */
  pricePerUnit: number;
  
  /** Total price for this line item (quantity * pricePerUnit) */
  totalPrice: number;
}

/**
 * Represents a complete customer order/purchase.
 * 
 * Contains all items purchased, total amount, and order status.
 * Used to display order history and track order fulfillment.
 * 
 * @interface CustomerOrder
 * 
 * @example
 * const order: CustomerOrder = {
 *   id: 'order-001',
 *   customerId: 'user-001',
 *   orderDate: '2024-01-15T10:30:00Z',
 *   items: [
 *     { isbn: '...', title: '...', quantity: 2, pricePerUnit: 14.99, totalPrice: 29.98 }
 *   ],
 *   totalAmount: 29.98,
 *   status: 'Completed'
 * };
 */
export interface CustomerOrder {
  /** Unique order identifier (UUID format) */
  id: string;
  
  /** Reference to the customer who placed the order */
  customerId: string; // Link order to a specific customer
  
  /** Date/time when order was placed (ISO 8601 format) */
  orderDate: string;
  
  /** Array of all items in the order */
  items: CustomerOrderItem[];
  
  /** Total order amount in USD (sum of all item totalPrices) */
  totalAmount: number;
  
  /** Current order status */
  status: 'Completed' | 'Processing' | 'Cancelled';
}
