/**
 * @fileoverview Pages Barrel Export
 * 
 * Re-exports all page components organized by user role/feature area.
 * Provides a single import point for page components.
 * 
 * @module pages
 * 
 * @example
 * import { Login, Home, Dashboard } from '../pages';
 */

/** Authentication pages: Login, Register */
export * from './auth';

/** Admin pages: Dashboard, BookManagement, OrderManagement, Reports */
export * from './admin';

/** Customer pages: Home, BrowseBooks, Cart, OrderHistory, Profile, EditProfile */
export * from './customer';
