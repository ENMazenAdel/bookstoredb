/**
 * @fileoverview Shopping Cart Type Definitions
 * 
 * This module defines TypeScript interfaces for the shopping cart
 * functionality, including cart items, cart state, and checkout data.
 * 
 * @module types/Cart
 */

import { Book } from './Book';

/**
 * Represents a single item in the shopping cart.
 * 
 * Combines a book reference with the quantity selected by the customer.
 * The full Book object is included to display book details in the cart
 * without additional API calls.
 * 
 * @interface CartItem
 * 
 * @example
 * const item: CartItem = {
 *   book: { isbn: '978-0-13-468599-1', title: 'The Great Gatsby', ... },
 *   quantity: 2
 * };
 */
export interface CartItem {
  /** Complete book object with all details */
  book: Book;
  
  /** Number of copies of this book in cart (1 or more) */
  quantity: number;
}

/**
 * Represents the complete shopping cart state.
 * 
 * Managed by CartContext and includes computed totals for
 * efficient display without recalculation in components.
 * 
 * @interface Cart
 * 
 * @example
 * const cart: Cart = {
 *   items: [
 *     { book: {...}, quantity: 2 },
 *     { book: {...}, quantity: 1 }
 *   ],
 *   totalItems: 3,    // 2 + 1
 *   totalPrice: 44.97 // (price1 * 2) + (price2 * 1)
 * };
 */
export interface Cart {
  /** Array of all items currently in the cart */
  items: CartItem[];
  
  /** Total number of books across all items (sum of quantities) */
  totalItems: number;
  
  /** Total price of all items in USD (sum of item prices * quantities) */
  totalPrice: number;
}

/**
 * Data collected during the checkout process.
 * 
 * Used by the Cart component to complete an order.
 * Contains credit card payment information for processing.
 * 
 * @interface CheckoutData
 * 
 * @example
 * const checkout: CheckoutData = {
 *   creditCardNumber: '4111111111111111',
 *   expiryDate: '12/25',
 *   cvv: '123'
 * };
 */
export interface CheckoutData {
  /** Credit card number (16 digits) */
  creditCardNumber: string;
  
  /** Card expiry date in MM/YY format */
  expiryDate: string;
  
  /** Card verification value (3-4 digits) */
  cvv: string;
}
