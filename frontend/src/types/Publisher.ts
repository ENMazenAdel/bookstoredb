/**
 * @fileoverview Publisher Type Definitions
 * 
 * This module defines TypeScript interfaces for book publisher data.
 * Publishers supply books to the bookstore and receive replenishment orders.
 * 
 * @module types/Publisher
 */

/**
 * Represents a book publisher in the system.
 * 
 * Publishers are business entities that supply books to the bookstore.
 * Used for displaying publisher information and placing stock orders.
 * 
 * @interface Publisher
 * 
 * @example
 * const publisher: Publisher = {
 *   id: 'pub-001',
 *   name: 'Penguin Random House',
 *   address: '1745 Broadway, New York, NY 10019',
 *   phone: '212-782-9000'
 * };
 */
export interface Publisher {
  /** Unique publisher identifier (UUID format) */
  id: string;
  
  /** Publisher's company/business name */
  name: string;
  
  /** Publisher's business address */
  address: string;
  
  /** Publisher's contact phone number */
  phone: string;
}
