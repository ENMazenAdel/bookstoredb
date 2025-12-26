/**
 * @fileoverview Publisher Order Type Definitions
 * 
 * This module defines TypeScript interfaces and types for publisher orders,
 * which represent stock replenishment orders placed with book publishers.
 * These are different from customer orders (see CustomerOrder.ts).
 * 
 * @module types/Order
 */

/**
 * Status enumeration for publisher orders.
 * 
 * Order lifecycle:
 * 1. Pending - Order created, awaiting confirmation
 * 2. Confirmed - Order confirmed by admin, stock will be added
 * 3. Cancelled - Order was cancelled (no stock change)
 * 
 * @example
 * const status: OrderStatus = 'Pending';
 */
export type OrderStatus = 'Pending' | 'Confirmed' | 'Cancelled';

/**
 * Represents a stock replenishment order to a book publisher.
 * 
 * Publisher orders are used by admins to restock inventory.
 * When confirmed, the ordered quantity is added to the book's stock.
 * Orders can be created manually or triggered automatically by the
 * database's low-stock threshold system.
 * 
 * @interface PublisherOrder
 * 
 * @example
 * const order: PublisherOrder = {
 *   id: 'ord-001',
 *   bookIsbn: '978-0-13-468599-1',
 *   bookTitle: 'The Great Gatsby',
 *   publisher: 'Penguin Books',
 *   quantity: 50,
 *   orderDate: '2024-01-15T10:30:00Z',
 *   status: 'Pending'
 * };
 */
export interface PublisherOrder {
  /** Unique order identifier (UUID format) */
  id: string;
  
  /** ISBN of the book being ordered */
  bookIsbn: string;
  
  /** Book title (denormalized for display) */
  bookTitle: string;
  
  /** Publisher's name */
  publisher: string;
  
  /** Number of copies to order */
  quantity: number;
  
  /** Date/time when order was placed (ISO 8601 format) */
  orderDate: string;
  
  /** Current status of the order */
  status: OrderStatus;
}

/**
 * Form data for creating a new publisher order.
 * 
 * Used by the OrderManagement component when admin places
 * a new stock replenishment order. Book details and publisher
 * are looked up from the selected ISBN.
 * 
 * @interface PublisherOrderFormData
 * 
 * @example
 * const formData: PublisherOrderFormData = {
 *   bookIsbn: '978-0-13-468599-1',
 *   quantity: 50
 * };
 */
export interface PublisherOrderFormData {
  /** Selected book's ISBN */
  bookIsbn: string;
  
  /** Quantity to order (must be positive) */
  quantity: number;
}
