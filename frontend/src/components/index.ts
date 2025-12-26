/**
 * @fileoverview Components Barrel Export
 * 
 * Re-exports all reusable UI components from the components directory.
 * Provides a single import point for component usage throughout the app.
 * 
 * @module components
 * 
 * @example
 * import { Navbar, Footer, BookCard, LoadingSpinner } from '../components';
 */

/** Navigation bar with role-based menu items and cart badge */
export { default as Navbar } from './Navbar';

/** Footer with site information and copyright */
export { default as Footer } from './Footer';

/** Route guard for authentication and role-based access control */
export { default as ProtectedRoute } from './ProtectedRoute';

/** Book display card with category styling and add-to-cart */
export { default as BookCard } from './BookCard';

/** Reusable loading spinner with size variants */
export { default as LoadingSpinner } from './LoadingSpinner';
