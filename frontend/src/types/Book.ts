/**
 * @fileoverview Book Type Definitions
 * 
 * This module defines TypeScript interfaces and types for book-related
 * data structures used throughout the bookstore application.
 * 
 * @module types/Book
 */

/**
 * Enumeration of available book categories.
 * 
 * Used for:
 * - Categorizing books in the inventory
 * - Filtering books in browse/search functionality
 * - Displaying category-specific styling (colors, icons)
 * 
 * @example
 * const category: BookCategory = 'Science';
 */
export type BookCategory = 'Science' | 'Art' | 'Religion' | 'History' | 'Geography';

/**
 * Represents a book in the bookstore inventory.
 * 
 * This interface defines the complete book record as stored in the database
 * and returned from the API. Used for displaying book information and
 * managing inventory.
 * 
 * @interface Book
 * 
 * @example
 * const book: Book = {
 *   isbn: '978-0-13-468599-1',
 *   title: 'The Great Gatsby',
 *   authors: ['F. Scott Fitzgerald'],
 *   publisher: 'Scribner',
 *   publicationYear: 1925,
 *   sellingPrice: 14.99,
 *   category: 'Art',
 *   quantity: 25,
 *   threshold: 5
 * };
 */
export interface Book {
  /** Unique identifier - International Standard Book Number (ISBN-13 format) */
  isbn: string;
  
  /** Full title of the book */
  title: string;
  
  /** Array of author names (supports multiple authors) */
  authors: string[];
  
  /** Publisher name */
  publisher: string;
  
  /** Year the book was published (4-digit year) */
  publicationYear: number;
  
  /** Retail selling price in USD */
  sellingPrice: number;
  
  /** Book category for classification and filtering */
  category: BookCategory;
  
  /** Current number of copies available in inventory */
  quantity: number;
  
  /** Minimum stock level - triggers auto-replenishment when reached */
  threshold: number;
  
  /** Optional URL to the book cover image */
  imageUrl?: string;
}

/**
 * Form data structure for creating or updating a book.
 * 
 * This interface differs from Book in that:
 * - Authors are provided as a comma-separated string (for form input)
 * - No imageUrl field (handled separately or auto-generated)
 * 
 * Used by BookManagement component for add/edit operations.
 * 
 * @interface BookFormData
 * 
 * @example
 * const formData: BookFormData = {
 *   isbn: '978-0-13-468599-1',
 *   title: 'The Great Gatsby',
 *   authors: 'F. Scott Fitzgerald',  // Comma-separated string
 *   publisher: 'Scribner',
 *   publicationYear: 1925,
 *   sellingPrice: 14.99,
 *   category: 'Art',
 *   quantity: 25,
 *   threshold: 5
 * };
 */
export interface BookFormData {
  /** ISBN identifier for the book */
  isbn: string;
  
  /** Book title */
  title: string;
  
  /** Authors as comma-separated string (converted to array on submit) */
  authors: string;
  
  /** Publisher name */
  publisher: string;
  
  /** Publication year */
  publicationYear: number;
  
  /** Selling price in USD */
  sellingPrice: number;
  
  /** Book category */
  category: BookCategory;
  
  /** Initial/current stock quantity */
  quantity: number;
  
  /** Minimum stock threshold for auto-reorder */
  threshold: number;
}
