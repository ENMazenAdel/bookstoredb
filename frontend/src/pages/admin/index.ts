/**
 * @fileoverview Admin Pages Barrel Export
 * 
 * Re-exports all admin-only page components.
 * These pages are protected and only accessible to users with 'admin' role.
 * 
 * @module pages/admin
 * 
 * @example
 * import { Dashboard, BookManagement, OrderManagement, Reports } from './admin';
 */

/** Dashboard - Admin overview with key business metrics and statistics */
export { default as Dashboard } from './Dashboard';

/** BookManagement - CRUD operations for book inventory */
export { default as BookManagement } from './BookManagement';

/** OrderManagement - Manage publisher stock replenishment orders */
export { default as OrderManagement } from './OrderManagement';

/** Reports - Sales analytics, top customers, and book performance reports */
export { default as Reports } from './Reports';
